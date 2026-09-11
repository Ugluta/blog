import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const items = await prisma.contentItem.findMany({
    where: { status: { in: ["SCRAPED", "REVISING", "IN_REVIEW", "REJECTED", "FAILED"] } },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { category: true, source: true },
  });

  return NextResponse.json({ items });
}
