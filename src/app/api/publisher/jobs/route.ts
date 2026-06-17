import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ jobs: [] });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};
  if (status) where.status = status.toUpperCase();
  if (platform) where.platform = platform.toUpperCase();

  const jobs = await prisma.publishJob.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      socialAccount: { select: { platform: true, handle: true } },
    },
  }).catch(() => []);

  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const body = await req.json();
  const { socialAccountId, caption, hashtags, scheduledAt, videoProjectId } = body;

  if (!socialAccountId || !caption) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
  }

  const account = await prisma.socialAccount.findFirst({
    where: { id: socialAccountId, userId: session.user.id, isActive: true },
    select: { id: true, platform: true },
  });
  if (!account) return NextResponse.json({ error: "Hesap bulunamadı" }, { status: 404 });

  const job = await prisma.publishJob.create({
    data: {
      userId: session.user.id,
      socialAccountId,
      videoProjectId: videoProjectId ?? null,
      platform: account.platform,
      caption,
      hashtags: hashtags ?? [],
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: scheduledAt ? "SCHEDULED" : "PENDING",
    },
  });

  return NextResponse.json({ job }, { status: 201 });
}
