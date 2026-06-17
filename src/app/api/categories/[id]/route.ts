import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const { name, slug: customSlug, description, icon, color, image, parentId, order, isActive } =
    await req.json();

  if (!name?.trim()) return NextResponse.json({ error: "Kategori adı zorunludur." }, { status: 400 });
  if (parentId === id) {
    return NextResponse.json({ error: "Kategori kendi üst kategorisi olamaz." }, { status: 400 });
  }

  const slug = customSlug?.trim() ? slugify(customSlug) : slugify(name);
  const conflict = await prisma.category.findFirst({ where: { slug, NOT: { id } } }).catch(() => null);
  const finalSlug = conflict ? `${slug}-${Date.now()}` : slug;

  const category = await prisma.category
    .update({
      where: { id },
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        color: color?.trim() || null,
        image: image?.trim() || null,
        parentId: parentId || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
      include: { _count: { select: { children: true, posts: true, contentItems: true } } },
    })
    .catch(() => null);

  if (!category) return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
  return NextResponse.json({ category });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  const counts = await prisma.category
    .findUnique({
      where: { id },
      include: { _count: { select: { children: true, posts: true, contentItems: true } } },
    })
    .catch(() => null);

  if (!counts) return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
  if (counts._count.children > 0)
    return NextResponse.json({ error: "Alt kategoriler silinmeden bu kategori silinemez." }, { status: 400 });
  if (counts._count.posts > 0 || counts._count.contentItems > 0)
    return NextResponse.json({ error: "İçerikleri kaldırmadan bu kategori silinemez." }, { status: 400 });

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
