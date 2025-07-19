import { Router } from "express";
import { prisma } from "../utils/database";
import { redis } from "../utils/redis";
import { logger } from "../utils/logger";

const router = Router();

// Basic health check
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User Service is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Detailed health check with dependencies
router.get("/detailed", async (req, res) => {
  const health = {
    success: true,
    message: "User Service health check",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    services: {
      database: "unknown",
      redis: "unknown",
    },
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = "healthy";
  } catch (error) {
    health.services.database = "unhealthy";
    health.success = false;
    logger.error("Database health check failed:", error);
  }

  try {
    // Check Redis connection
    await redis.ping();
    health.services.redis = "healthy";
  } catch (error) {
    health.services.redis = "unhealthy";
    health.success = false;
    logger.error("Redis health check failed:", error);
  }

  const statusCode = health.success ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness check
router.get("/ready", async (req, res) => {
  try {
    // Check if all dependencies are ready
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();

    res.json({
      success: true,
      message: "User Service is ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Readiness check failed:", error);
    res.status(503).json({
      success: false,
      message: "User Service is not ready",
      timestamp: new Date().toISOString(),
    });
  }
});

// Liveness check
router.get("/live", (req, res) => {
  res.json({
    success: true,
    message: "User Service is alive",
    timestamp: new Date().toISOString(),
    pid: process.pid,
  });
});

export { router as healthCheck };
