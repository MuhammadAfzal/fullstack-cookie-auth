import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { logger } from "../utils/logger";

const WINDOW_MS = parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || "900000"); // 15 minutes
const MAX_REQUESTS = parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || "100");

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || "unknown";
    const key = `rate_limit:${clientIp}`;

    // Get current request count
    const current = await redis.get(key);
    const currentCount = current ? parseInt(current) : 0;

    if (currentCount >= MAX_REQUESTS) {
      logger.warn(`Rate limit exceeded for IP: ${clientIp}`);
      res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
        retryAfter: Math.ceil(WINDOW_MS / 1000),
      });
      return;
    }

    // Increment request count
    await redis
      .multi()
      .incr(key)
      .expire(key, Math.ceil(WINDOW_MS / 1000))
      .exec();

    // Add rate limit headers
    res.set({
      "X-RateLimit-Limit": MAX_REQUESTS.toString(),
      "X-RateLimit-Remaining": Math.max(
        0,
        MAX_REQUESTS - currentCount - 1
      ).toString(),
      "X-RateLimit-Reset": new Date(Date.now() + WINDOW_MS).toISOString(),
    });

    next();
  } catch (error) {
    logger.error("Rate limiter error:", error);
    // Continue without rate limiting if Redis is down
    next();
  }
};
