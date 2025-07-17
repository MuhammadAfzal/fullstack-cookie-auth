import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true });
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Fallback
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
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
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true });
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getProfile(req.cookies.token);
    console.log("user", user);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
