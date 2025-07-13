import { Router } from "express";
import { loginSchema, registerSchema } from "../validators/auth";
import { validate } from "../middlewares/validate";
import {
  login,
  logout,
  register,
  getProfile,
} from "../controllers/authController";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", getProfile);

export default router;
