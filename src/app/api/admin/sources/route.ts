import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json({ sources });
}

export async function POST(req: Request) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, url, type, categoryId, htmlSelector } = body;

  if (!name || !url || !type) {
    return NextResponse.json({ error: "name, url ve type gerekli" }, { status: 400 });
  }
  if (type !== "RSS" && type !== "HTML") {
    return NextResponse.json({ error: "type RSS veya HTML olmalı" }, { status: 400 });
  }

  const source = await prisma.source.create({
    data: { name, url, type, categoryId: categoryId || null, htmlSelector: htmlSelector || null },
  });

  return NextResponse.json({ source }, { status: 201 });
}
