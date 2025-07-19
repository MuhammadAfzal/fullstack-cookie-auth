import { Router } from "express";

const router = Router();

// Placeholder for upload routes
router.get("/", (req, res) => {
  res.json({ message: "Upload routes - to be implemented" });
});

export { router as uploadRoutes };
