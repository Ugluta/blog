import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ album: null });
  }

  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } }, _count: { select: { images: true } } },
  }).catch(() => null);

  if (!album) return NextResponse.json({ error: "Albüm bulunamadı" }, { status: 404 });
  return NextResponse.json({ album });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantı hatası" }, { status: 500 });
  }

  const album = await prisma.galleryAlbum.update({
    where: { id, userId: session.user.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
      ...(body.order !== undefined && { order: body.order }),
    },
  }).catch(() => null);

  if (!album) return NextResponse.json({ error: "Albüm bulunamadı" }, { status: 404 });
  return NextResponse.json({ album });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantı hatası" }, { status: 500 });
  }

  await prisma.galleryAlbum.delete({ where: { id, userId: session.user.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
