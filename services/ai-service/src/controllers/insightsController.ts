import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { generateInsights } from "../services/insightsService";

const InsightsRequestSchema = z.object({
  totalUsers: z.number().optional(),
  newUsersThisMonth: z.number().optional(),
  newUsersToday: z.number().optional(),
  roleDistribution: z
    .array(
      z.object({
        role: z.string(),
        count: z.number(),
        percentage: z.number().optional(),
      })
    )
    .optional(),
});

export async function postInsights(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = InsightsRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, error: parsed.error.flatten() });
    }
    const insights = await generateInsights(parsed.data);
    res.json({ success: true, insights });
  } catch (err) {
    next(err);
  }
}
