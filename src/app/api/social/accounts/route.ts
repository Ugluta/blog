import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  let prisma: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ accounts: [] });
  }

  const accounts = await prisma.socialAccount
    .findMany({
      where: { userId: session.user.id, isActive: true },
      select: {
        id: true,
        platform: true,
        displayName: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    })
    .catch(() => []);

  return NextResponse.json({ accounts });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  let prisma: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantı hatası" }, { status: 500 });
  }

  await prisma.socialAccount
    .updateMany({
      where: { id, userId: session.user.id },
      data: { isActive: false },
    })
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
