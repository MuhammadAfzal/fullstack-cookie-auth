import { Router } from "express";
import { requireAuth } from "../middlewares/jwtMiddleware";
import {
  getDashboardSummary,
  getDashboardChartData,
  getDashboardActivity,
} from "../controllers/dashboardController";

const router = Router();

router.get("/summary", requireAuth, getDashboardSummary);
router.get("/chart-data", requireAuth, getDashboardChartData);
router.get("/activity", requireAuth, getDashboardActivity);

export default router;
