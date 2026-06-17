import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const body = await req.json();
  const source = await prisma.scraperSource.update({
    where: { id },
    data: body,
  }).catch(() => null);

  if (!source) return NextResponse.json({ error: "Kaynak bulunamadı" }, { status: 404 });
  return NextResponse.json({ source });
}

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

  await prisma.scraperSource.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
