import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const userId = searchParams.get("userId");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ albums: [] });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { isPublic: true };
  if (categoryId) where.categoryId = categoryId;
  if (userId) { where.userId = userId; delete where.isPublic; }

  const albums = await prisma.galleryAlbum.findMany({
    where,
    take: limit,
    skip: (page - 1) * limit,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { images: true } } },
  }).catch(() => []);

  return NextResponse.json({ albums });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { title, description, coverImage, categoryId, isPublic, order } = body;
  if (!title) return NextResponse.json({ error: "Başlık gerekli" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantı hatası" }, { status: 500 });
  }

  let slug = (body.slug || slugify(title)) as string;
  const existing = await prisma.galleryAlbum.findUnique({ where: { slug } }).catch(() => null);
  if (existing) slug = `${slug}-${Date.now()}`;

  const album = await prisma.galleryAlbum.create({
    data: {
      title,
      slug,
      description: description ?? null,
      coverImage: coverImage ?? null,
      categoryId: categoryId ?? null,
      isPublic: isPublic !== false,
      order: order ?? 0,
      userId: session.user.id,
    },
  }).catch((e: Error) => { throw e; });

  return NextResponse.json({ album }, { status: 201 });
}
