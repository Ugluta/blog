import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const post = await prisma.post
    .findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true, icon: true } },
      },
    })
    .catch(() => null);

  if (!post) return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const {
    title, slug: customSlug, excerpt, content, coverImage,
    status, categoryId, tags, featured, metaTitle, metaDescription,
  } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Başlık zorunludur." }, { status: 400 });

  const current = await prisma.post.findUnique({ where: { id } }).catch(() => null);
  if (!current) return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });

  let slug = customSlug?.trim() ? slugify(customSlug) : current.slug;
  if (slug !== current.slug) {
    const conflict = await prisma.post.findFirst({ where: { slug, NOT: { id } } }).catch(() => null);
    if (conflict) slug = `${slug}-${Date.now()}`;
  }

  const wasPublished = current.status === "PUBLISHED";
  const nowPublished = status === "PUBLISHED";

  const post = await prisma.post
    .update({
      where: { id },
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt?.trim() || null,
        content: content ?? "",
        coverImage: coverImage?.trim() || null,
        status: status ?? current.status,
        publishedAt: !wasPublished && nowPublished ? new Date() : current.publishedAt,
        categoryId: categoryId || null,
        tags: tags ?? [],
        featured: featured ?? false,
        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true, icon: true } },
      },
    })
    .catch(() => null);

  if (!post) return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  return NextResponse.json({ post });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
