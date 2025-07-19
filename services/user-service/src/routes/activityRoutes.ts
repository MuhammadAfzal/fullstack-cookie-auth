import { Router } from "express";

const router = Router();

// Placeholder for activity routes
router.get("/", (req, res) => {
  res.json({ message: "Activity routes - to be implemented" });
});

export { router as activityRoutes };
