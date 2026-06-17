import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PACKAGES } from "@/lib/packages";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const [subscription, usageStat, socialCount] = await Promise.all([
    prisma.subscription
      .findUnique({
        where: { userId: session.user.id },
        include: { package: true },
      })
      .catch(() => null),
    prisma.usageStat.findUnique({ where: { userId: session.user.id } }).catch(() => null),
    prisma.socialAccount.count({ where: { userId: session.user.id } }).catch(() => 0),
  ]);

  const packageSlug = subscription?.package?.slug ?? "free";
  const packageDef = PACKAGES.find((p) => p.slug === packageSlug) ?? PACKAGES[0];

  return NextResponse.json({
    subscription: subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          billingPeriod: subscription.billingPeriod,
          expiresAt: subscription.expiresAt,
          autoRenew: subscription.autoRenew,
          package: {
            slug: subscription.package.slug,
            name: subscription.package.name,
            price: subscription.package.price,
            yearlyPrice: subscription.package.yearlyPrice,
          },
        }
      : null,
    currentPlan: packageSlug,
    limits: {
      videoPerMonth: packageDef.videoPerMonth,
      storageGb: packageDef.storageGb,
      socialAccounts: packageDef.socialAccounts,
    },
    usage: {
      videosThisMonth: usageStat?.videosThisMonth ?? 0,
      storageUsedGb: usageStat?.storageUsedGb ?? 0,
      socialAccounts: socialCount,
    },
  });
}
