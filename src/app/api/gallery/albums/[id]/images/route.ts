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
    return NextResponse.json({ images: [] });
  }

  const images = await prisma.galleryImage.findMany({
    where: { albumId: id },
    orderBy: { order: "asc" },
  }).catch(() => []);

  return NextResponse.json({ images });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { url, title, description, thumbnailUrl, width, height, order } = body;

  if (!url) return NextResponse.json({ error: "URL gerekli" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantı hatası" }, { status: 500 });
  }

  const image = await prisma.galleryImage.create({
    data: {
      albumId: id,
      url,
      title: title ?? null,
      description: description ?? null,
      thumbnailUrl: thumbnailUrl ?? null,
      width: width ?? null,
      height: height ?? null,
      order: order ?? 0,
    },
  }).catch((e: Error) => { throw e; });

  return NextResponse.json({ image }, { status: 201 });
}
