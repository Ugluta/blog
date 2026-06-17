import * as cheerio from 'cheerio';
import { db } from '@/lib/db';
import { ContentType } from '@prisma/client';

export interface ScrapedItem {
  title: string;
  url: string;
  excerpt?: string;
  content?: string;
  image?: string;
  publishedAt?: Date;
}

export async function scrapeSource(sourceId: string): Promise<{
  found: number;
  saved: number;
  error?: string;
}> {
  const source = await db.scraperSource.findUnique({ where: { id: sourceId } });
  if (!source) throw new Error('Kaynak bulunamadı');

  let found = 0;
  let saved = 0;

  try {
    const response = await fetch(source.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OgretmenEvrak/1.0)' },
      next: { revalidate: 0 },
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const items: ScrapedItem[] = [];

    const selector = source.selector || 'article, .post, .news-item, .haber';
    $(selector).each((_, el) => {
      const titleEl = $(el).find(source.titleSelector || 'h2, h3, .title, .baslik').first();
      const title = titleEl.text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const img = $(el).find('img').first().attr('src') || '';
      const excerpt = $(el).find('p, .excerpt, .ozet').first().text().trim();

      if (title && title.length > 10) {
        items.push({
          title,
          url: link.startsWith('http') ? link : new URL(link, source.url).href,
          excerpt: excerpt.substring(0, 300),
          image: img.startsWith('http') ? img : (img ? new URL(img, source.url).href : undefined),
        });
      }
    });

    found = items.length;

    const admin = await db.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    if (!admin) throw new Error('Admin kullanıcı bulunamadı');

    for (const item of items) {
      const slugBase = item.title
        .toLowerCase()
        .replace(/[^a-z0-9çğıöşü]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 80);

      const existing = await db.news.findUnique({ where: { slug: slugBase } });
      if (existing) continue;

      await db.news.create({
        data: {
          title: item.title,
          slug: slugBase,
          excerpt: item.excerpt || '',
          content: item.content || item.excerpt || item.title,
          image: item.image,
          type: source.contentType as ContentType,
          status: source.autoPublish ? 'PUBLISHED' : 'DRAFT',
          authorId: admin.id,
          isAiGenerated: false,
          sourceUrl: item.url,
          sourceName: source.name,
          publishedAt: source.autoPublish ? new Date() : null,
        },
      });
      saved++;
    }

    await db.scraperSource.update({
      where: { id: sourceId },
      data: { lastScraped: new Date() },
    });

    return { found, saved };
  } catch (error) {
    return { found, saved, error: error instanceof Error ? error.message : 'Bilinmeyen hata' };
  }
}
