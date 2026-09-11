import "dotenv/config";
import { Queue, Worker, type Job } from "bullmq";
import { redis } from "./lib/redis";
import { scrapeAllActiveSources } from "./lib/scraper";
import { reviseScrapedBatch } from "./lib/ai-revise";
import { autoPublishApprovedBatch } from "./lib/publish";

const QUEUE_NAME = "content-pipeline";

const SCRAPE_INTERVAL_MS = Number(process.env.SCRAPE_INTERVAL_MS || 15 * 60_000); // 15 dk
const REVISE_INTERVAL_MS = Number(process.env.REVISE_INTERVAL_MS || 5 * 60_000); // 5 dk
const PUBLISH_INTERVAL_MS = Number(process.env.PUBLISH_INTERVAL_MS || 10 * 60_000); // 10 dk

const pipelineQueue = new Queue(QUEUE_NAME, { connection: redis });

type JobName = "scrape" | "revise" | "publish";

async function runJob(name: JobName) {
  switch (name) {
    case "scrape": {
      const results = await scrapeAllActiveSources();
      const total = results.reduce((sum, r) => sum + r.inserted, 0);
      console.log(`[worker] scrape: ${total} yeni öğe havuza eklendi (${results.length} kaynak)`);
      return { total };
    }
    case "revise": {
      const revised = await reviseScrapedBatch(10);
      console.log(`[worker] revise: ${revised} öğe AI ile revize edildi`);
      return { revised };
    }
    case "publish": {
      const published = await autoPublishApprovedBatch(10);
      console.log(`[worker] publish: ${published} öğe otomatik yayınlandı`);
      return { published };
    }
  }
}

async function scheduleRepeatingJobs() {
  await pipelineQueue.upsertJobScheduler(
    "scrape-cycle",
    { every: SCRAPE_INTERVAL_MS },
    { name: "scrape", opts: { removeOnComplete: 50, removeOnFail: 50 } }
  );
  await pipelineQueue.upsertJobScheduler(
    "revise-cycle",
    { every: REVISE_INTERVAL_MS },
    { name: "revise", opts: { removeOnComplete: 50, removeOnFail: 50 } }
  );
  await pipelineQueue.upsertJobScheduler(
    "publish-cycle",
    { every: PUBLISH_INTERVAL_MS },
    { name: "publish", opts: { removeOnComplete: 50, removeOnFail: 50 } }
  );
  console.log("[worker] scrape/revise/publish döngüleri zamanlandı");
}

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => runJob(job.name as JobName),
  { connection: redis, concurrency: 1 }
);

worker.on("completed", (job) => {
  console.log(`[worker] tamamlandı: ${job.name} (#${job.id})`);
});

worker.on("failed", (job, err) => {
  console.error(`[worker] başarısız: ${job?.name} (#${job?.id}):`, err);
});

async function bootstrap() {
  await scheduleRepeatingJobs();
  // İlk çalıştırmada döngüyü bekletmeden bir kez tetikle (scrape -> revise -> publish sırasıyla).
  await pipelineQueue.add("scrape", {}, { removeOnComplete: 50, removeOnFail: 50 });
  console.log("[worker] çalışıyor, Redis'e bağlı, ilk scrape job'u kuyruğa eklendi");
}

bootstrap().catch((err) => {
  console.error("[worker] başlatma hatası:", err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  await worker.close();
  await pipelineQueue.close();
  process.exit(0);
});
