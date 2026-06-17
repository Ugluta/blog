import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const sourceId = searchParams.get("sourceId") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));

  const where = {
    ...(status ? { status } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(sourceId ? { sourceId } : {}),
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.contentItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
      },
    }),
    prisma.contentItem.count({ where }),
  ]).catch(() => [[], 0] as const);

  return NextResponse.json({ items, total, page, limit });
}
