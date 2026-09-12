import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "news";

  const categories = await prisma.category // eslint-disable-line @typescript-eslint/no-explicit-any
    .findMany({
      where: { categoryType: type },
      orderBy: [{ parentId: "asc" }, { order: "asc" }, { name: "asc" }],
    })
    .catch(() => []);

  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { name, slug, description, icon, image, color, parentId, order, categoryType } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Kategori adı zorunludur." }, { status: 400 });

  const baseSlug = slug?.trim() || name.trim().toLowerCase()
    .replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ş/g, "s")
    .replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existing = await (prisma as any).category.findUnique({ where: { slug: baseSlug } }).catch(() => null);
  const finalSlug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = await (prisma as any).category.create({
    data: {
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      color: color?.trim() || null,
      image: image?.trim() || null,
      parentId: parentId || null,
      order: order ?? 0,
      categoryType: categoryType || "news",
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
