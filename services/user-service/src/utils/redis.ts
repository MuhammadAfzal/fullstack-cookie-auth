import Redis from "ioredis";
import { logger } from "./logger";

const redis = new Redis(process.env["REDIS_URL"] || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
});

redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("error", (error) => {
  logger.error("Redis connection error:", error);
});

redis.on("close", () => {
  logger.warn("Redis connection closed");
});

redis.on("reconnecting", () => {
  logger.info("Redis reconnecting...");
});

async function connectRedis() {
  try {
    await redis.ping();
    logger.info("Redis ping successful");
  } catch (error) {
    logger.error("Redis connection failed:", error);
    throw error;
  }
}

async function disconnectRedis() {
  try {
    await redis.quit();
    logger.info("Redis disconnected successfully");
  } catch (error) {
    logger.error("Redis disconnection failed:", error);
    throw error;
  }
}

export { redis, connectRedis, disconnectRedis };
