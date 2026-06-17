import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ sources: [] });
  }

  const sources = await prisma.scraperSource.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return NextResponse.json({ sources });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantısı yok" }, { status: 503 });
  }

  const body = await req.json();
  const { name, url, type, interval, aiProvider, aiTask, autoPublish, categoryId, selectors } = body;

  if (!name || !url || !type) {
    return NextResponse.json({ error: "Ad, URL ve tip zorunludur." }, { status: 400 });
  }

  const source = await prisma.scraperSource.create({
    data: {
      name,
      url,
      type,
      interval: interval ?? 60,
      aiProvider: aiProvider ?? "Claude",
      aiTask: aiTask ?? "rewrite",
      autoPublish: autoPublish ?? false,
      categoryId: categoryId ?? null,
      selectors: selectors ? JSON.stringify(selectors) : null,
      status: "active",
    },
  });

  return NextResponse.json({ source }, { status: 201 });
}
