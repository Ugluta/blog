import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// RevenueCat webhook event types
type RCEventType =
  | "INITIAL_PURCHASE"
  | "RENEWAL"
  | "CANCELLATION"
  | "UNCANCELLATION"
  | "NON_RENEWING_PURCHASE"
  | "SUBSCRIPTION_PAUSED"
  | "EXPIRATION"
  | "BILLING_ISSUE"
  | "PRODUCT_CHANGE"
  | "TRANSFER";

interface RCWebhookPayload {
  event: {
    type: RCEventType;
    app_user_id: string;
    product_id: string;
    entitlement_ids: string[] | null;
    expiration_at_ms: number | null;
    purchased_at_ms: number;
    store: "APP_STORE" | "PLAY_STORE" | "STRIPE";
    environment: "PRODUCTION" | "SANDBOX";
    price_in_purchased_currency: number | null;
    currency: string | null;
    presented_offering_identifier: string | null;
    period_type: "NORMAL" | "TRIAL" | "INTRO";
    subscriber_attributes: Record<string, { value: string }>;
    transaction_id: string;
    original_transaction_id: string;
  };
  api_version: string;
}

function verifySignature(body: string, header: string | null): boolean {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(header));
}

async function handleEvent(payload: RCWebhookPayload): Promise<void> {
  const { event } = payload;
  const userId = event.subscriber_attributes?.["$email"]?.value ?? event.app_user_id;

  // Map RevenueCat entitlement → package slug
  const entitlementToPackage: Record<string, string> = {
    pro_access: "pro",
    starter_access: "starter",
    enterprise_access: "enterprise",
  };

  // Dynamic import to avoid build errors when DB unavailable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    console.warn("[revenuecat] prisma unavailable, skipping DB update");
    return;
  }

  if (!prisma) return;

  switch (event.type) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "UNCANCELLATION": {
      const entitlement = event.entitlement_ids?.[0];
      const pkgSlug = entitlement ? entitlementToPackage[entitlement] : null;
      if (!pkgSlug) break;

      const pkg = await prisma.package.findUnique({ where: { slug: pkgSlug } });
      if (!pkg) break;

      const user = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { email: userId }] },
      });
      if (!user) break;

      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          packageId: pkg.id,
          status: "ACTIVE",
          billingPeriod: "MONTHLY",
          expiresAt: event.expiration_at_ms ? new Date(event.expiration_at_ms) : null,
          autoRenew: true,
        },
        update: {
          packageId: pkg.id,
          status: "ACTIVE",
          expiresAt: event.expiration_at_ms ? new Date(event.expiration_at_ms) : null,
          canceledAt: null,
          autoRenew: true,
        },
      });
      break;
    }

    case "CANCELLATION": {
      const user = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { email: userId }] },
      });
      if (!user) break;
      await prisma.subscription.updateMany({
        where: { userId: user.id },
        data: { autoRenew: false, canceledAt: new Date() },
      });
      break;
    }

    case "EXPIRATION": {
      const user = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { email: userId }] },
      });
      if (!user) break;
      // Downgrade to free package
      const freePkg = await prisma.package.findUnique({ where: { slug: "free" } });
      if (!freePkg) break;
      await prisma.subscription.updateMany({
        where: { userId: user.id },
        data: { packageId: freePkg.id, status: "EXPIRED" },
      });
      break;
    }

    case "BILLING_ISSUE": {
      const user = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { email: userId }] },
      });
      if (!user) break;
      await prisma.subscription.updateMany({
        where: { userId: user.id },
        data: { status: "PAST_DUE" },
      });
      break;
    }

    default:
      // PRODUCT_CHANGE, TRANSFER, NON_RENEWING_PURCHASE, SUBSCRIPTION_PAUSED handled if needed
      break;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-revenuecat-signature");

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: RCWebhookPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Skip sandbox events in production
  if (
    process.env.NODE_ENV === "production" &&
    payload.event.environment === "SANDBOX"
  ) {
    return NextResponse.json({ skipped: "sandbox" });
  }

  try {
    await handleEvent(payload);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[revenuecat webhook]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
