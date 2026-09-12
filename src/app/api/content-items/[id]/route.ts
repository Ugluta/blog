import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.contentItem
    .findUnique({
      where: { id },
      include: { category: true },
    })
    .catch(() => null);

  if (!item) return NextResponse.json({ error: "İçerik bulunamadı." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const { title, content, image, categoryId, status } = await req.json();

  const item = await prisma.contentItem
    .update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(categoryId !== undefined ? { categoryId: categoryId || null } : {}),
        ...(status !== undefined ? { status } : {}),
      },
      include: { category: { select: { id: true, name: true, color: true, icon: true } } },
    })
    .catch(() => null);

  if (!item) return NextResponse.json({ error: "Güncellenemedi." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  await prisma.contentItem.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
