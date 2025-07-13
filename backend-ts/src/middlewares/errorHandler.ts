import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("❌ Error:", err);

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
}
