import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  if (!["PENDING", "SCHEDULED"].includes(job.status)) {
    return NextResponse.json({ error: "Sadece bekleyen işler iptal edilebilir." }, { status: 400 });
  }

  await prisma.publishJob.update({
    where: { id },
    data: { status: "CANCELED" },
  });

  return NextResponse.json({ ok: true });
}
