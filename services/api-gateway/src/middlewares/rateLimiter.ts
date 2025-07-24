import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../utils/redis";
import { logger } from "../utils/logger";

const WINDOW_MS = parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || "900000"); // 15 minutes
const MAX_REQUESTS = parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || "100");

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "api_gateway_rate_limit",
  points: MAX_REQUESTS,
  duration: Math.ceil(WINDOW_MS / 1000),
  blockDuration: Math.ceil(WINDOW_MS / 1000),
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || "unknown";

    await rateLimiter.consume(clientIp);

    // Add rate limit headers
    const rateLimitInfo = await rateLimiter.get(clientIp);
    if (rateLimitInfo) {
      res.set({
        "X-RateLimit-Limit": MAX_REQUESTS.toString(),
        "X-RateLimit-Remaining": Math.max(
          0,
          rateLimitInfo.remainingPoints
        ).toString(),
        "X-RateLimit-Reset": new Date(Date.now() + WINDOW_MS).toISOString(),
      });
    }

    next();
  } catch (error: any) {
    if (error.msBeforeNext) {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
      });
    } else {
      logger.error("Rate limiter error:", error);
      // Continue without rate limiting if Redis is down
      next();
    }
  }
};
