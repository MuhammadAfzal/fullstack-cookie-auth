import { Router } from "express";
import { getAllUsers } from "../controllers/userController";
import { requireAuth } from "../middlewares/jwtMiddleware";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// Admin-only route
router.get("/admin/users", requireAuth, requireRole("ADMIN"), getAllUsers);

export default router;
