import { Request, Response } from "express";
import * as profileService from "../services/profileService";

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const profile = await profileService.getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const updateData = req.body;
    const updatedProfile = await profileService.updateUserProfile(
      userId,
      updateData
    );
    res.json(updatedProfile);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    if (error.message === "Email is already taken") {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to update profile" });
    }
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedProfile = await profileService.uploadAvatar(userId, req.file);
    res.json(updatedProfile);
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    if (
      error.message.includes("Invalid file type") ||
      error.message.includes("File too large")
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to upload avatar" });
    }
  }
}

export async function deleteAvatar(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const updatedProfile = await profileService.deleteAvatar(userId);
    res.json(updatedProfile);
  } catch (error) {
    console.error("Error deleting avatar:", error);
    res.status(500).json({ message: "Failed to delete avatar" });
  }
}
