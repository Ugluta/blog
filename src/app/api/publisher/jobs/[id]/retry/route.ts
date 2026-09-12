import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantısı yok" }, { status: 503 });
  }

  const job = await prisma.publishJob.findUnique({ where: { id } }).catch(() => null);
  if (!job) return NextResponse.json({ error: "İş bulunamadı" }, { status: 404 });

  if (job.status !== "FAILED") {
    return NextResponse.json({ error: "Sadece başarısız işler yeniden denenebilir." }, { status: 400 });
  }

  const retried = await prisma.publishJob.update({
    where: { id },
    data: {
      status: "PENDING",
      errorMessage: null,
      retryCount: { increment: 1 },
      scheduledAt: new Date(),
    },
  });

  // Enqueue in BullMQ if Redis is available
  try {
    const { scraperQueue } = await import("@/lib/scraper/queue");
    await scraperQueue.add("publish", { jobId: retried.id }, { jobId: `publish-${retried.id}` });
  } catch {
    // Redis unavailable — job stays in PENDING, will be picked up by worker when Redis comes online
  }

  return NextResponse.json({ ok: true });
}
