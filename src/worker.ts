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

  // ── Scraper branch ────────────────────────────────────────────────────────
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

  // ── Publisher branch ──────────────────────────────────────────────────────
  if (jobId) {
    const prisma = await getPrisma();

    const publishJob = await (prisma as any).publishJob.findUnique({ // eslint-disable-line @typescript-eslint/no-explicit-any
      where: { id: jobId },
      include: {
        socialAccount: true,
        videoProject: true,
      },
    });

    if (!publishJob) {
      console.warn(`[Worker] Publish job not found: ${jobId}`);
      return;
    }

    await (prisma as any).publishJob.update({ // eslint-disable-line @typescript-eslint/no-explicit-any
      where: { id: jobId },
      data: { status: "PROCESSING" },
    });

    try {
      const { publishToPlatform } = await import("@/lib/publisher");

      const result = await publishToPlatform(
        {
          platform: publishJob.socialAccount.platform,
          accessToken: publishJob.socialAccount.accessToken,
          refreshToken: publishJob.socialAccount.refreshToken,
          platformUserId: publishJob.socialAccount.platformUserId,
          metadata: publishJob.socialAccount.metadata as Record<string, string> | null,
        },
        {
          caption: publishJob.caption,
          hashtags: publishJob.hashtags ?? [],
          videoUrl: publishJob.videoProject?.outputUrl ?? null,
          imageUrl: publishJob.videoProject?.thumbnail ?? null,
          title: publishJob.videoProject?.title ?? null,
        }
      );

      await (prisma as any).publishJob.update({ // eslint-disable-line @typescript-eslint/no-explicit-any
        where: { id: jobId },
        data: {
          status: "SUCCESS",
          publishedAt: new Date(),
          platformPostId: result.platformPostId,
          platformUrl: result.platformUrl ?? null,
          error: null,
        },
      });

      console.log(`[Worker] Published job ${jobId} → ${publishJob.socialAccount.platform} (${result.platformPostId})`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[Worker] Publish job ${jobId} failed:`, message);

      await (prisma as any).publishJob.update({ // eslint-disable-line @typescript-eslint/no-explicit-any
        where: { id: jobId },
        data: {
          status: "FAILED",
          error: message,
          retryCount: { increment: 1 },
        },
      });
    }
  }
});

worker.on("completed", (job) => console.log(`[Worker] Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`[Worker] Job ${job?.id} failed:`, err.message));

console.log("[Worker] Scraper/publisher worker started");
