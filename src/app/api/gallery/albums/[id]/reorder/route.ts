import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { id }, select: { userId: true } });
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string);
  if (album.userId !== session.user.id && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { items } = await req.json() as { items: { id: string; order: number }[] };

  await Promise.all(
    items.map(item => prisma.galleryImage.update({ where: { id: item.id }, data: { order: item.order } }))
  );

  return NextResponse.json({ ok: true });
}
