import { z } from "zod";

export const userValidators = {
  // Update user schema
  updateUser: z.object({
    body: z.object({
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      bio: z.string().max(500).optional(),
      location: z.string().max(100).optional(),
      website: z.string().url().optional(),
      phone: z.string().max(20).optional(),
      dateOfBirth: z.string().datetime().optional(),
      gender: z
        .enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
        .optional(),
      avatar: z.string().url().optional(),
    }),
  }),

  // Update preferences schema
  updatePreferences: z.object({
    body: z.object({
      emailNotifications: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
      smsNotifications: z.boolean().optional(),
      profileVisibility: z
        .enum(["PUBLIC", "PRIVATE", "FRIENDS_ONLY"])
        .optional(),
      showEmail: z.boolean().optional(),
      showPhone: z.boolean().optional(),
      showLocation: z.boolean().optional(),
      theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
      language: z.string().min(2).max(5).optional(),
      timezone: z.string().optional(),
      autoPlayVideos: z.boolean().optional(),
      showMatureContent: z.boolean().optional(),
    }),
  }),

  // Search users schema
  searchUsers: z.object({
    query: z.object({
      q: z.string().min(1).max(100),
      page: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
    }),
  }),

  // Get user by ID schema
  getUserById: z.object({
    params: z.object({
      id: z.string().min(1),
    }),
  }),

  // Get user by username schema
  getUserByUsername: z.object({
    params: z.object({
      username: z.string().min(1).max(50),
    }),
  }),
};
