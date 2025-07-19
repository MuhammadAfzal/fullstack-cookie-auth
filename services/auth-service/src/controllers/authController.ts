import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createLogger } from "@shared/common";

const logger = createLogger("auth-controller");

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.register(req.body);
    logger.info("User registered successfully", { username: user.username });
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return res
        .status(409)
        .json({ success: false, error: "Username already exists." });
    }
    logger.error("Registration failed", { error: err.message });
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await authService.login(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    logger.info("User logged in successfully", { username: req.body.username });
    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    logger.error("Login failed", { error: err });
    next(err);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  logger.info("User logged out successfully");
  res.json({ success: true, message: "Logout successful" });
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getProfile(req.cookies.token);
    logger.info("Profile retrieved successfully", { userId: user.id });
    res.json({ success: true, user });
  } catch (err) {
    logger.error("Profile retrieval failed", { error: err });
    next(err);
  }
};
