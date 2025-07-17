// src/controllers/userController.ts
import { Request, Response } from "express";
import * as userService from "../services/userService";

export async function getProfile(req: Request, res: Response) {
  const user = req.user!;
  const profile = await userService.getUserProfile(user.id);
  res.json(profile);
}

export async function getAllUsers(_req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json(users);
}
