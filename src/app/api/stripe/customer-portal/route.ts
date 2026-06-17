import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  void req;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "Veritabanı bağlantısı kurulamadı." }, { status: 503 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "Stripe müşteri kaydı bulunamadı." }, { status: 404 });
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

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${baseUrl}/uygulama/abonelik`,
  });

  return NextResponse.json({ url: portalSession.url });
}
