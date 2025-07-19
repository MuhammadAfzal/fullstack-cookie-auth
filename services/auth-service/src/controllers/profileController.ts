import { Request, Response } from "express";
import * as profileService from "../services/profileService";
import { createLogger } from "@shared/common";

const logger = createLogger("profile-controller");

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const profile = await profileService.getUserProfile(userId);
    logger.info("Profile retrieved successfully", { userId });
    res.json({ success: true, data: profile });
  } catch (error) {
    logger.error("Error getting profile:", { error, userId: req.user?.id });
    res.status(500).json({ success: false, error: "Failed to get profile" });
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
    logger.info("Profile updated successfully", { userId });
    res.json({ success: true, data: updatedProfile });
  } catch (error: any) {
    logger.error("Error updating profile:", {
      error: error.message,
      userId: req.user?.id,
    });
    if (error.message === "Email is already taken") {
      res.status(409).json({ success: false, error: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Failed to update profile" });
    }
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const updatedProfile = await profileService.uploadAvatar(userId, req.file);
    logger.info("Avatar uploaded successfully", { userId });
    res.json({ success: true, data: updatedProfile });
  } catch (error: any) {
    logger.error("Error uploading avatar:", {
      error: error.message,
      userId: req.user?.id,
    });
    if (
      error.message.includes("Invalid file type") ||
      error.message.includes("File too large")
    ) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Failed to upload avatar" });
    }
  }
}

export async function deleteAvatar(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const updatedProfile = await profileService.deleteAvatar(userId);
    logger.info("Avatar deleted successfully", { userId });
    res.json({ success: true, data: updatedProfile });
  } catch (error) {
    logger.error("Error deleting avatar:", { error, userId: req.user?.id });
    res.status(500).json({ success: false, error: "Failed to delete avatar" });
  }
}
