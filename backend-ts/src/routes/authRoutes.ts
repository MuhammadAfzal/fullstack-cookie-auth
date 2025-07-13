import { Router } from "express";
import {
  login,
  logout,
  register,
  getProfile,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getProfile);

export default router;
