import { PrismaClient } from "@prisma/client";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { User } from "@shared/common";

const prisma = new PrismaClient();

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  phone?: string;
}

export async function getUserProfile(userId: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatar: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user as any;
}

export async function updateUserProfile(
  userId: number,
  data: UpdateProfileData
): Promise<User> {
  // Check if email is already taken by another user
  if (data.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: userId },
      },
    });
    if (existingUser) {
      throw new Error("Email is already taken");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      bio: data.bio,
      phone: data.phone,
    },
    select: {
      id: true,
      username: true,
      role: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatar: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser as any;
}

export async function uploadAvatar(
  userId: number,
  file: Express.Multer.File
): Promise<User> {
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  // Get current user to check if they have an existing avatar
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });

  // Generate unique filename
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = join(process.cwd(), "uploads", "avatars", fileName);

  // Save the new file
  await writeFile(filePath, file.buffer);

  // Update user's avatar in database
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: fileName },
    select: {
      id: true,
      username: true,
      role: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatar: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Delete old avatar file if it exists
  if (currentUser?.avatar) {
    const oldAvatarPath = join(
      process.cwd(),
      "uploads",
      "avatars",
      currentUser.avatar
    );
    try {
      await unlink(oldAvatarPath);
    } catch (error) {
      // Ignore error if file doesn't exist
      console.log("Old avatar file not found, skipping deletion");
    }
  }

  return updatedUser as any;
}

export async function deleteAvatar(userId: number): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });

  if (user?.avatar) {
    const avatarPath = join(process.cwd(), "uploads", "avatars", user.avatar);
    try {
      await unlink(avatarPath);
    } catch (error) {
      console.log("Avatar file not found, skipping deletion");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: null },
    select: {
      id: true,
      username: true,
      role: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatar: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser as any;
}
