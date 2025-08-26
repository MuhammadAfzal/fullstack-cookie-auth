import { Router } from "express";
import { postInsights } from "../controllers/insightsController";

const router = Router();

router.post("/insights", postInsights);

export default router;
