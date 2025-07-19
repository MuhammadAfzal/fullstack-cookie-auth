import { Router } from "express";

const router = Router();

// Placeholder for post routes
router.get("/", (req, res) => {
  res.json({ message: "Post routes - to be implemented" });
});

export { router as postRoutes };
