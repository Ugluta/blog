import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  const item = await prisma.contentItem.findUnique({ where: { id } }).catch(() => null);
  if (!item) return NextResponse.json({ error: "İçerik bulunamadı." }, { status: 404 });

  let slug = slugify(item.title);
  const existing = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await prisma.post.create({
    data: {
      title: item.title,
      slug,
      content: item.content,
      coverImage: item.image ?? null,
      status: "DRAFT",
      authorId: session.user.id,
      categoryId: item.categoryId ?? null,
    },
  });

  // Mark content item as published
  await prisma.contentItem.update({ where: { id }, data: { status: "published" } }).catch(() => null);

  return NextResponse.json({ post }, { status: 201 });
}
