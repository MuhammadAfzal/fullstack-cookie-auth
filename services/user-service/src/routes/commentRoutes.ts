import { Router } from "express";

const router = Router();

// Placeholder for comment routes
router.get("/", (req, res) => {
  res.json({ message: "Comment routes - to be implemented" });
});

export { router as commentRoutes };
