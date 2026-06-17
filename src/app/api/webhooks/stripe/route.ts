import { NextRequest, NextResponse } from "next/server";

// Stripe webhook — handles subscription lifecycle events from web payments.
// Requires STRIPE_WEBHOOK_SECRET env var (from `stripe listen` or Stripe Dashboard).
// Full Stripe SDK available after: npm install stripe

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !sig) {
    return NextResponse.json({ error: "Missing webhook secret or signature" }, { status: 400 });
  }

  // Verify signature via Stripe SDK
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stripe: any;
  try {
    const Stripe = (await import("stripe")).default;
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });
  } catch {
    return NextResponse.json({ error: "Stripe SDK not installed" }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.mode !== "subscription") break;
      const customerId: string = session.customer;
      const subscriptionId: string = session.subscription;
      const userId: string = session.metadata?.userId ?? session.client_reference_id;
      if (!userId) break;

      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId: string = sub.items.data[0]?.price?.id;

      const pkg = await prisma.package.findFirst({
        where: { OR: [{ stripePriceId: priceId }, { stripeYearlyPriceId: priceId }] },
      });
      if (!pkg) break;

      const isYearly = pkg.stripeYearlyPriceId === priceId;

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          packageId: pkg.id,
          status: "ACTIVE",
          billingPeriod: isYearly ? "YEARLY" : "MONTHLY",
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          expiresAt: new Date(sub.current_period_end * 1000),
          autoRenew: true,
        },
        update: {
          packageId: pkg.id,
          status: "ACTIVE",
          billingPeriod: isYearly ? "YEARLY" : "MONTHLY",
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          expiresAt: new Date(sub.current_period_end * 1000),
          canceledAt: null,
          autoRenew: true,
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      const subscriptionId: string = invoice.subscription;
      if (!subscriptionId) break;
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: "ACTIVE",
          expiresAt: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: invoice.subscription },
        data: { status: "PAST_DUE" },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const freePkg = await prisma.package.findUnique({ where: { slug: "free" } });
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status: "EXPIRED",
          ...(freePkg ? { packageId: freePkg.id } : {}),
          canceledAt: new Date(),
          autoRenew: false,
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object;
      const priceId: string = sub.items.data[0]?.price?.id;
      const pkg = await prisma.package.findFirst({
        where: { OR: [{ stripePriceId: priceId }, { stripeYearlyPriceId: priceId }] },
      });
      if (!pkg) break;
      const isYearly = pkg.stripeYearlyPriceId === priceId;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          packageId: pkg.id,
          billingPeriod: isYearly ? "YEARLY" : "MONTHLY",
          status: sub.status === "active" ? "ACTIVE" : sub.status === "past_due" ? "PAST_DUE" : "CANCELED",
          expiresAt: new Date(sub.current_period_end * 1000),
          autoRenew: !sub.cancel_at_period_end,
        },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
