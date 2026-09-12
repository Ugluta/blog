import { Queue, Worker, type Job } from "bullmq";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

// Parse REDIS_URL to ioredis connection options
function parseRedisUrl(url: string) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: parseInt(u.port || "6379", 10),
      password: u.password || undefined,
      tls: u.protocol === "rediss:" ? {} : undefined,
    };
  } catch {
    return { host: "localhost", port: 6379 };
  }
}

const connection = parseRedisUrl(redisUrl);

export const scraperQueue = new Queue("scraper", { connection });

export function createScraperWorker(
  processor: (job: Job) => Promise<void>
) {
  return new Worker("scraper", processor, { connection });
}
