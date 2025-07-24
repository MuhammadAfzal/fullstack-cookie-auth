import { Router } from "express";
import { proxyService } from "../services/proxyService";
import { logger } from "../utils/logger";

const router = Router();

// Basic health check
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env["NODE_ENV"] || "development",
  });
});

// Detailed health check with microservices
router.get("/detailed", async (req, res) => {
  const health = {
    success: true,
    message: "API Gateway health check",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env["NODE_ENV"] || "development",
    services: {
      gateway: "healthy",
      auth: "unknown",
      user: "unknown",
    },
  };

  try {
    // Check microservices health
    const servicesHealth = await proxyService.healthCheck();

    health.services.auth = servicesHealth.auth ? "healthy" : "unhealthy";
    health.services.user = servicesHealth.user ? "healthy" : "unhealthy";

    // Overall health depends on all services
    if (!servicesHealth.auth || !servicesHealth.user) {
      health.success = false;
    }
  } catch (error) {
    logger.error("Health check error:", error);
    health.success = false;
  }

  const statusCode = health.success ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness check
router.get("/ready", async (req, res) => {
  try {
    // Check if all services are ready
    const servicesHealth = await proxyService.healthCheck();

    if (servicesHealth.auth && servicesHealth.user) {
      res.json({
        success: true,
        message: "API Gateway is ready",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        success: false,
        message: "API Gateway is not ready - some services are unavailable",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    logger.error("Readiness check failed:", error);
    res.status(503).json({
      success: false,
      message: "API Gateway is not ready",
      timestamp: new Date().toISOString(),
    });
  }
});

// Liveness check
router.get("/live", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway is alive",
    timestamp: new Date().toISOString(),
    pid: process.pid,
  });
});

export { router as healthCheck };
