import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/database";
import { logger } from "../utils/logger";
import { CustomError } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export const userController = {
  // Get current user
  getCurrentUser: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          preferences: true,
          statistics: true,
        },
      });

      if (!user) {
        return next(new CustomError("User not found", 404));
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          preferences: true,
          statistics: true,
        },
      });

      if (!user) {
        return next(new CustomError("User not found", 404));
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user by username
  getUserByUsername: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { username } = req.params;

      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          preferences: true,
          statistics: true,
        },
      });

      if (!user) {
        return next(new CustomError("User not found", 404));
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Search users
  searchUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page = "1", limit = "10" } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      if (!q) {
        return next(new CustomError("Search query is required", 400));
      }

      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q as string, mode: "insensitive" } },
            { firstName: { contains: q as string, mode: "insensitive" } },
            { lastName: { contains: q as string, mode: "insensitive" } },
            { email: { contains: q as string, mode: "insensitive" } },
          ],
          isActive: true,
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          location: true,
          isVerified: true,
          createdAt: true,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.user.count({
        where: {
          OR: [
            { username: { contains: q as string, mode: "insensitive" } },
            { firstName: { contains: q as string, mode: "insensitive" } },
            { lastName: { contains: q as string, mode: "insensitive" } },
            { email: { contains: q as string, mode: "insensitive" } },
          ],
          isActive: true,
        },
      });

      res.json({
        success: true,
        data: users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user
  updateUser: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const updateData = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: {
          preferences: true,
          statistics: true,
        },
      });

      res.json({
        success: true,
        data: user,
        message: "User updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete user
  deleteUser: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      await prisma.user.delete({
        where: { id: userId },
      });

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user statistics
  getUserStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const stats = await prisma.userStatistics.findUnique({
        where: { userId: id },
      });

      if (!stats) {
        return next(new CustomError("User statistics not found", 404));
      }

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user activities
  getUserActivities: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { page = "1", limit = "20" } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const activities = await prisma.userActivity.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      });

      const total = await prisma.userActivity.count({
        where: { userId: id },
      });

      res.json({
        success: true,
        data: activities,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user preferences
  getUserPreferences: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const preferences = await prisma.userPreferences.findUnique({
        where: { userId: id },
      });

      if (!preferences) {
        return next(new CustomError("User preferences not found", 404));
      }

      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user preferences
  updateUserPreferences: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const preferences = await prisma.userPreferences.upsert({
        where: { userId: id },
        update: updateData,
        create: {
          userId: id,
          ...updateData,
        },
      });

      res.json({
        success: true,
        data: preferences,
        message: "User preferences updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
