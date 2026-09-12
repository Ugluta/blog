import axios from "axios";
import * as cheerio from "cheerio";
import RssParser from "rss-parser";

export interface ScrapedArticle {
  title: string;
  content: string;
  url: string;
  image?: string;
  publishedAt?: Date;
  sourceId: string;
}

export interface ScraperSource {
  id: string;
  type: "rss" | "news_site" | "blog" | "twitter" | "youtube";
  url: string;
  selectors?: {
    articleList?: string;
    title?: string;
    content?: string;
    image?: string;
    date?: string;
  };
}

const rssParser = new RssParser({
  customFields: {
    item: [["media:content", "mediaContent"], ["media:thumbnail", "mediaThumbnail"]],
  },
});

export async function scrapeSource(source: ScraperSource): Promise<ScrapedArticle[]> {
  switch (source.type) {
    case "rss":
      return scrapeRss(source);
    case "news_site":
    case "blog":
      return scrapeHtml(source);
    case "twitter":
    case "youtube":
      return []; // Requires API keys — handled elsewhere
    default:
      return [];
  }
}

async function scrapeRss(source: ScraperSource): Promise<ScrapedArticle[]> {
  const feed = await rssParser.parseURL(source.url);
  return feed.items.slice(0, 20).map((item) => ({
    title: item.title ?? "",
    content: item.contentSnippet ?? item.content ?? item.summary ?? "",
    url: item.link ?? "",
    image:
      (item as unknown as Record<string, unknown>).mediaThumbnail as string | undefined ??
      (item as unknown as Record<string, unknown>).mediaContent as string | undefined,
    publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
    sourceId: source.id,
  }));
}

async function scrapeHtml(source: ScraperSource): Promise<ScrapedArticle[]> {
  const sel = source.selectors ?? {};
  const articleListSel = sel.articleList ?? "article, .post, .news-item, h2 a, h3 a";
  const titleSel = sel.title ?? "h1, h2, .title";
  const contentSel = sel.content ?? "p, .content, .entry-content, article";
  const imageSel = sel.image ?? "img";

  const { data: html } = await axios.get<string>(source.url, {
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0 (compatible; KurumsalBot/1.0)" },
  });

  const $ = cheerio.load(html);
  const articles: ScrapedArticle[] = [];

  $(articleListSel).each((_, el) => {
    const $el = $(el);
    const title = $el.find(titleSel).first().text().trim() || $el.text().trim();
    const href = $el.is("a") ? $el.attr("href") : $el.find("a").first().attr("href");
    if (!title || !href) return;

    const url = href.startsWith("http") ? href : new URL(href, source.url).toString();
    const image = $el.find(imageSel).first().attr("src");
    const content = $el.find(contentSel).first().text().trim().slice(0, 500);

    articles.push({ title, content, url, image, sourceId: source.id });
    if (articles.length >= 10) return false; // Cheerio each() break
  });

  return articles;
}
