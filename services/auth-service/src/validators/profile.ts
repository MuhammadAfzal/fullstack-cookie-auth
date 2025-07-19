import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  bio: z.string().max(500, "Bio too long").optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
