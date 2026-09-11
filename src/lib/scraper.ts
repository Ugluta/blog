import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { prisma } from "./prisma";
import type { Source } from "@prisma/client";

const rssParser = new Parser({
  timeout: 15_000,
  headers: { "User-Agent": "ikie-bot/1.0 (+https://ikie.net)" },
});

export type ScrapedEntry = {
  sourceUrl: string;
  title: string;
  content: string;
};

async function scrapeRss(source: Source): Promise<ScrapedEntry[]> {
  const feed = await rssParser.parseURL(source.url);
  return feed.items
    .filter((item) => item.link)
    .map((item) => ({
      sourceUrl: item.link as string,
      title: item.title?.trim() || "(başlıksız)",
      content: (item.contentSnippet || item.content || item.summary || "").trim(),
    }));
}

async function scrapeHtml(source: Source): Promise<ScrapedEntry[]> {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "ikie-bot/1.0 (+https://ikie.net)" },
  });
  if (!res.ok) {
    throw new Error(`HTML kaynağı alınamadı (${res.status}): ${source.url}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const selector = source.htmlSelector || "article a";

  const entries: ScrapedEntry[] = [];
  const seen = new Set<string>();

  $(selector).each((_, el) => {
    const href = $(el).attr("href");
    if (!href || seen.has(href)) return;
    const title = $(el).text().trim();
    if (!title) return;
    seen.add(href);
    entries.push({
      sourceUrl: new URL(href, source.url).toString(),
      title,
      content: title,
    });
  });

  return entries;
}

/**
 * Bir kaynağı tarar, yeni bulunan öğeleri ContentItem havuzuna SCRAPED
 * durumunda ekler. Zaten var olan sourceUrl'ler atlanır (dedupe).
 */
export async function scrapeSource(source: Source): Promise<number> {
  const entries =
    source.type === "RSS" ? await scrapeRss(source) : await scrapeHtml(source);

  let inserted = 0;
  for (const entry of entries) {
    try {
      await prisma.contentItem.create({
        data: {
          sourceId: source.id,
          categoryId: source.categoryId,
          sourceUrl: entry.sourceUrl,
          rawTitle: entry.title,
          rawContent: entry.content,
          status: "SCRAPED",
        },
      });
      inserted += 1;
    } catch (err: unknown) {
      // unique constraint (sourceUrl) => bu öğe zaten havuzda, atla
      const code = (err as { code?: string })?.code;
      if (code !== "P2002") throw err;
    }
  }

  await prisma.source.update({
    where: { id: source.id },
    data: { lastScrapedAt: new Date() },
  });

  return inserted;
}

export async function scrapeAllActiveSources(): Promise<{ sourceId: string; inserted: number }[]> {
  const sources = await prisma.source.findMany({ where: { active: true } });
  const results: { sourceId: string; inserted: number }[] = [];
  for (const source of sources) {
    try {
      const inserted = await scrapeSource(source);
      results.push({ sourceId: source.id, inserted });
    } catch (err) {
      console.error(`[scraper] kaynak hatası ${source.name} (${source.url}):`, err);
    }
  }
  return results;
}
