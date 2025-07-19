import { Router } from "express";

const router = Router();

// Placeholder for profile routes
router.get("/", (req, res) => {
  res.json({ message: "Profile routes - to be implemented" });
});

export { router as profileRoutes };
