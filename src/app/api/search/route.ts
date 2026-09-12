import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? "all"; // all|post|album
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], total: 0, query: q });
  }

  const where = {
    OR: [
      { title: { contains: q, mode: "insensitive" as const } },
      { excerpt: { contains: q, mode: "insensitive" as const } },
      { content: { contains: q, mode: "insensitive" as const } },
    ],
  };

  try {
    const results: {
      id: string; type: string; title: string; slug: string;
      excerpt?: string | null; coverImage?: string | null;
      publishedAt?: Date | null; createdAt: Date;
      category?: { name: string; slug: string } | null;
    }[] = [];

    let total = 0;

    if (type === "all" || type === "post") {
      const [posts, count] = await Promise.all([
        prisma.post.findMany({
          where: { ...where, status: "PUBLISHED" },
          select: {
            id: true, title: true, slug: true, excerpt: true,
            coverImage: true, publishedAt: true, createdAt: true,
            category: { select: { name: true, slug: true } },
          },
          orderBy: { publishedAt: "desc" },
          skip: type === "post" ? skip : 0,
          take: type === "post" ? limit : 6,
        }),
        prisma.post.count({ where: { ...where, status: "PUBLISHED" } }),
      ]);
      posts.forEach((p: typeof posts[0]) => results.push({ ...p, type: "post" }));
      if (type === "post") total = count;
      else total += count;
    }

    if (type === "all" || type === "album") {
      const [albums, count] = await Promise.all([
        prisma.galleryAlbum.findMany({
          where: {
            isPublic: true,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
          select: {
            id: true, title: true, slug: true, description: true,
            coverImage: true, createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: type === "album" ? skip : 0,
          take: type === "album" ? limit : 4,
        }),
        prisma.galleryAlbum.count({
          where: {
            isPublic: true,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
        }),
      ]);
      albums.forEach((a: typeof albums[0]) => results.push({ ...a, type: "album", excerpt: a.description }));
      if (type === "album") total = count;
      else total += count;
    }

    return NextResponse.json({ results, total, query: q, page, limit });
  } catch {
    return NextResponse.json({ results: [], total: 0, query: q });
  }
}
