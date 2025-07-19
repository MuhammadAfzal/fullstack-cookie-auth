import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { AppError } from "./errors";
import { createLogger } from "./logger";

const logger = createLogger("middleware");

export const securityMiddleware = [
  helmet(),
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  }),
];

export const commonMiddleware = [
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }),
  cookieParser(),
];

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error occurred:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }

  // Handle Prisma errors
  if (error.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      error: "Database operation failed",
    });
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};

export const healthCheck =
  (serviceName: string) => (req: Request, res: Response) => {
    res.json({
      service: serviceName,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
    });
  };
