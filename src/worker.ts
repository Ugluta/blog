/**
 * BullMQ scraper/publisher worker — run with:
 *   npx tsx src/worker.ts
 * or add to package.json scripts: "worker": "tsx src/worker.ts"
 *
 * Requires REDIS_URL and DATABASE_URL env vars.
 */

import { createScraperWorker } from "@/lib/scraper/queue";
import { scrapeSource } from "@/lib/scraper/runner";

async function getPrisma() {
  const mod = await import("@/lib/prisma");
  return mod.prisma;
}

const worker = createScraperWorker(async (job) => {
  const { jobId, sourceId } = job.data as { jobId?: string; sourceId?: string };

  if (sourceId) {
    const prisma = await getPrisma();
    const source = await (prisma as any).scraperSource.findUnique({ where: { id: sourceId } }); // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!source) return;

    const articles = await scrapeSource({
      id: source.id,
      type: source.type,
      url: source.url,
      selectors: source.selectors ? JSON.parse(source.selectors) : undefined,
    });

    await (prisma as any).scraperSource.update({ // eslint-disable-line @typescript-eslint/no-explicit-any
      where: { id: sourceId },
      data: { lastRunAt: new Date(), articlesFound: { increment: articles.length }, status: "active" },
    });

    for (const article of articles.slice(0, 10)) {
      await (prisma as any).contentItem?.create({ // eslint-disable-line @typescript-eslint/no-explicit-any
        data: {
          title: article.title,
          content: article.content,
          sourceUrl: article.url,
          image: article.image,
          publishedAt: article.publishedAt,
          sourceId: source.id,
          status: source.autoPublish ? "published" : "draft",
          category: source.targetCategory,
        },
      }).catch(() => null);
    }
  }

  if (jobId) {
    // TODO: publisher worker — post to social platform
    console.log("[Worker] Publish job:", jobId);
  }
});

worker.on("completed", (job) => console.log(`[Worker] Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`[Worker] Job ${job?.id} failed:`, err.message));

console.log("[Worker] Scraper/publisher worker started");
