import IORedis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: IORedis };

function createConnection() {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL tanımlı değil (bkz. .env.example).");
  }
  return new IORedis(url, {
    maxRetriesPerRequest: null,
  });
}

export const redis = globalForRedis.redis ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
