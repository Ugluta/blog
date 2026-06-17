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
