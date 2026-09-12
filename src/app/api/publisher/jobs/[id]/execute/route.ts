import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  let prisma: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantı hatası" }, { status: 500 });
  }

  const job = await prisma.publishJob
    .findUnique({ where: { id, userId: session.user.id } })
    .catch(() => null);

  if (!job) return NextResponse.json({ error: "İş bulunamadı" }, { status: 404 });

  if (!["PENDING", "FAILED"].includes(job.status)) {
    return NextResponse.json({ error: `Bu iş çalıştırılamaz (durum: ${job.status})` }, { status: 400 });
  }

  await prisma.publishJob.update({
    where: { id },
    data: { status: "QUEUED", error: null },
  });

  try {
    const { scraperQueue } = await import("@/lib/scraper/queue");
    await scraperQueue.add(
      "publish",
      { jobId: id },
      { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
    );
  } catch {
    // Redis unavailable — reset to PENDING so it can be retried
    await prisma.publishJob.update({ where: { id }, data: { status: "PENDING" } });
    return NextResponse.json({ error: "Kuyruk servisi erişilemiyor" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, status: "QUEUED" });
}
