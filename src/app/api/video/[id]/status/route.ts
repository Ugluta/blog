import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const project = await prisma.videoProject.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      outputUrl: true,
      duration: true,
      renderError: true,
      updatedAt: true,
    },
  }).catch(() => null);

  if (!project) return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
  return NextResponse.json({ project });
}
