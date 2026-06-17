import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const categories = await prisma.category
    .findMany({
      orderBy: [{ parentId: "asc" }, { order: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { children: true, posts: true, contentItems: true } },
      },
    })
    .catch(() => []);

  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { name, slug: customSlug, description, icon, color, image, parentId, order } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Kategori adı zorunludur." }, { status: 400 });

  let slug = customSlug?.trim() ? slugify(customSlug) : slugify(name);

  const existing = await prisma.category.findUnique({ where: { slug } }).catch(() => null);
  if (existing) slug = `${slug}-${Date.now()}`;

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      color: color?.trim() || null,
      image: image?.trim() || null,
      parentId: parentId || null,
      order: order ?? 0,
    },
    include: { _count: { select: { children: true, posts: true, contentItems: true } } },
  });

  return NextResponse.json({ category }, { status: 201 });
}
