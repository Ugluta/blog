import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXTAUTH_URL ?? "https://example.com";
const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE ?? "Blog";
const SITE_DESC = process.env.NEXT_PUBLIC_SITE_DESC ?? "En güncel haberler ve içerikler";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: { title: string; slug: string; excerpt?: string | null; publishedAt?: Date | null; coverImage?: string | null }[] = [];

  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { title: true, slug: true, excerpt: true, publishedAt: true, coverImage: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });
  } catch { /* no DB */ }

  const items = posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE}/haberler/${escapeXml(post.slug)}</link>
      <guid isPermaLink="true">${BASE}/haberler/${escapeXml(post.slug)}</guid>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
      ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ""}
      ${post.coverImage ? `<enclosure url="${escapeXml(post.coverImage)}" type="image/jpeg" length="0" />` : ""}
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${BASE}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
