import { Router } from "express";

const router = Router();

// Placeholder for connection routes
router.get("/", (req, res) => {
  res.json({ message: "Connection routes - to be implemented" });
});

export { router as connectionRoutes };
