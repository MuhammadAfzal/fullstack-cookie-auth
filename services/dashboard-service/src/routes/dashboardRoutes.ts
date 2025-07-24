import { Router } from "express";
import { requireAuth } from "@shared/common";
import {
  getDashboardSummary,
  getDashboardChartData,
  getDashboardActivity,
  getDashboardMetrics,
} from "../controllers/dashboardController";

const router = Router();

router.get("/summary", requireAuth, getDashboardSummary);
router.get("/chart-data", requireAuth, getDashboardChartData);
router.get("/activity", requireAuth, getDashboardActivity);
router.get("/metrics", requireAuth, getDashboardMetrics);

export default router;
