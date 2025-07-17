import { Router } from "express";
import { getProfile, getAllUsers } from "../controllers/userController";
import { requireAuth } from "../middlewares/jwtMiddleware";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// Admin-only route
router.get("/admin/users", requireAuth, requireRole("ADMIN"), getAllUsers);

// User-only profile
router.get("/profile", requireRole("USER", "ADMIN"), getProfile);

export default router;
