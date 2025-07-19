import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../validators/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getProfile);

export default router;
