import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Stripe price IDs configured per plan in environment variables.
// Set these after creating products/prices in your Stripe Dashboard.
const PRICE_IDS: Record<string, { monthly?: string; yearly?: string }> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  enterprise: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
  },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  let body: { planSlug?: string; billing?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const { planSlug, billing = "monthly" } = body;
  if (!planSlug || planSlug === "free") {
    return NextResponse.json({ error: "Geçersiz plan." }, { status: 400 });
  }

  const priceId = billing === "yearly"
    ? PRICE_IDS[planSlug]?.yearly
    : PRICE_IDS[planSlug]?.monthly;

  if (!priceId) {
    return NextResponse.json({ error: "Bu plan için fiyat yapılandırılmamış." }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Ödeme sistemi yapılandırılmamış." }, { status: 503 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stripe: any;
  try {
    const Stripe = (await import("stripe")).default;
    stripe = new Stripe(stripeKey, { apiVersion: "2026-05-27.dahlia" });
  } catch {
    return NextResponse.json({ error: "Stripe SDK yüklenemedi." }, { status: 500 });
  }

  // Check if user already has a Stripe customer ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    // DB unavailable — proceed without customer lookup
  }

  let stripeCustomerId: string | undefined;
  if (prisma) {
    const existing = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { stripeCustomerId: true },
    }).catch(() => null);
    stripeCustomerId = existing?.stripeCustomerId ?? undefined;
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    client_reference_id: session.user.id,
    metadata: { userId: session.user.id, planSlug, billing },
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: { userId: session.user.id },
    },
    customer_email: stripeCustomerId ? undefined : session.user.email!,
    allow_promotion_codes: true,
    success_url: `${baseUrl}/odeme/basarili?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/uygulama/abonelik`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
