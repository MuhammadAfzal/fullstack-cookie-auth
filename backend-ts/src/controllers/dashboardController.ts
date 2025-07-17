import { Request, Response } from "express";
import * as dashboardService from "../services/dashboardService";

export async function getDashboardSummary(req: Request, res: Response) {
  const summary = await dashboardService.getDashboardSummary();
  res.json(summary);
}

export async function getDashboardChartData(req: Request, res: Response) {
  const chartData = await dashboardService.getDashboardChartData();
  res.json(chartData);
}

export async function getDashboardActivity(req: Request, res: Response) {
  const activity = await dashboardService.getDashboardActivity();
  res.json(activity);
}
