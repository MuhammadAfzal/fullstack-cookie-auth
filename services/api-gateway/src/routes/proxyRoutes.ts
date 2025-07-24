import { Router } from "express";
import { proxyService } from "../services/proxyService";

const router = Router();

// Generic proxy route for testing
router.get("/status", async (req, res, next) => {
  try {
    const servicesHealth = await proxyService.healthCheck();
    res.json({
      success: true,
      message: "Proxy status",
      services: servicesHealth,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    next(error);
  }
});

export { router as proxyRoutes };
