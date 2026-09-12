import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scrapeSource } from "@/lib/scraper/runner";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "DB bağlantısı yok" }, { status: 503 });
  }

  const source = await prisma.scraperSource.findUnique({ where: { id } }).catch(() => null);
  if (!source) return NextResponse.json({ error: "Kaynak bulunamadı" }, { status: 404 });

  try {
    const articles = await scrapeSource({
      id: source.id,
      type: source.type,
      url: source.url,
      selectors: source.selectors ? JSON.parse(source.selectors) : undefined,
    });

    // Update last run time and article count
    await prisma.scraperSource.update({
      where: { id },
      data: {
        lastRunAt: new Date(),
        articlesFound: { increment: articles.length },
        status: "active",
      },
    }).catch(() => null);

    // Store scraped articles as drafts (if ContentItem model exists)
    for (const article of articles.slice(0, 5)) {
      await prisma.contentItem?.create({
        data: {
          title: article.title,
          content: article.content,
          sourceUrl: article.url,
          image: article.image,
          publishedAt: article.publishedAt,
          sourceId: source.id,
          status: source.autoPublish ? "published" : "draft",
          categoryId: source.categoryId ?? null,
        },
      }).catch(() => null);
    }

    return NextResponse.json({ ok: true, count: articles.length });
  } catch (err) {
    await prisma.scraperSource.update({
      where: { id },
      data: { status: "error", lastRunAt: new Date() },
    }).catch(() => null);

    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
