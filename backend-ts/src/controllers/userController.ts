// src/controllers/userController.ts
import { Request, Response } from "express";
import * as userService from "../services/userService";

export async function getProfile(req: Request, res: Response) {
  const user = req.user!;
  const profile = await userService.getUserProfile(user.id);
  res.json(profile);
}

export async function getAllUsers(req: Request, res: Response) {
  const skip = parseInt(req.query.skip as string) || 0;
  const take = parseInt(req.query.take as string) || 50;
  const { users, total } = await userService.getAllUsers({ skip, take });
  res.json({ users, total });
}
