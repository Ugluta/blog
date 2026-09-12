import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import type { PostStatus } from "@/generated/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));

  const where = {
    ...(status ? { status: status as PostStatus } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { excerpt: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true, icon: true } },
      },
    }),
    prisma.post.count({ where }),
  ]).catch(() => [[], 0] as const);

  return NextResponse.json({ posts, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const {
    title, slug: customSlug, excerpt, content, coverImage,
    status, categoryId, tags, featured, metaTitle, metaDescription,
  } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Başlık zorunludur." }, { status: 400 });

  let slug = customSlug?.trim() ? slugify(customSlug) : slugify(title);
  const existing = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || null,
      content: content ?? "",
      coverImage: coverImage?.trim() || null,
      status: status ?? "DRAFT",
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId: session.user.id,
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
  });

  return NextResponse.json({ post }, { status: 201 });
}
