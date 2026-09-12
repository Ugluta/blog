import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalCategories,
    totalContentItems,
    pendingContentItems,
    totalSources,
    activeSources,
    recentPosts,
    recentContentItems,
  ] = await Promise.all([
    prisma.post.count().catch(() => 0),
    prisma.post.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.post.count({ where: { status: "DRAFT" } }).catch(() => 0),
    prisma.category.count().catch(() => 0),
    prisma.contentItem.count().catch(() => 0),
    prisma.contentItem.count({ where: { status: "draft" } }).catch(() => 0),
    prisma.scraperSource.count().catch(() => 0),
    prisma.scraperSource.count({ where: { status: "active" } }).catch(() => 0),
    prisma.post
      .findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
          category: { select: { name: true } },
        },
      })
      .catch(() => []),
    prisma.contentItem
      .findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          sourceUrl: true,
          createdAt: true,
          category: { select: { name: true } },
        },
      })
      .catch(() => []),
  ]);

  return NextResponse.json({
    posts: { total: totalPosts, published: publishedPosts, draft: draftPosts },
    categories: { total: totalCategories },
    contentItems: { total: totalContentItems, pending: pendingContentItems },
    sources: { total: totalSources, active: activeSources },
    recentPosts,
    recentContentItems,
  });
}
