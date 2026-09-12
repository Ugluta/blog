import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const range = req.nextUrl.searchParams.get("range") ?? "7d";

  const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const [totalPosts, publishedPosts, topPosts, recentPosts, totalViews, publishJobs] = await Promise.all([
      prisma.post.count({ where: { authorId: userId } }),
      prisma.post.count({ where: { authorId: userId, status: "PUBLISHED" } }),
      prisma.post.findMany({
        where: { authorId: userId, status: "PUBLISHED" },
        select: { id: true, title: true, slug: true, viewCount: true, publishedAt: true },
        orderBy: { viewCount: "desc" },
        take: 5,
      }),
      prisma.post.findMany({
        where: { authorId: userId, createdAt: { gte: since } },
        select: { id: true, title: true, slug: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.post.aggregate({
        where: { authorId: userId },
        _sum: { viewCount: true },
      }),
      prisma.publishJob.groupBy({
        by: ["status"],
        where: { userId },
        _count: true,
      }),
    ]);

    const publishStats = publishJobs.reduce((acc: Record<string, number>, g: { status: string; _count: number }) => {
      acc[g.status] = g._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      posts: { total: totalPosts, published: publishedPosts, draft: totalPosts - publishedPosts },
      views: { total: totalViews._sum?.viewCount ?? 0 },
      topPosts,
      recentPosts,
      publishStats,
      range,
    });
  } catch {
    return NextResponse.json({
      posts: { total: 0, published: 0, draft: 0 },
      views: { total: 0 },
      topPosts: [],
      recentPosts: [],
      publishStats: {},
      range,
    });
  }
}
