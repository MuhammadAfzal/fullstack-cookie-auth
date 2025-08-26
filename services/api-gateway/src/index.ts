import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { logger } from "./utils/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { rateLimiterMiddleware } from "./middlewares/rateLimiter";
import { healthCheck } from "./routes/healthRoutes";
import { authRoutes } from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { proxyRoutes } from "./routes/proxyRoutes";
import { connectRedis } from "./utils/redis";
import dashboardRoutes from "./routes/dashboardRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";
import aiRoutes from "./routes/aiRoutes";

// Load environment variables
config();

const app = express();
const PORT = process.env["PORT"] || 3000;

// Trust proxy for rate limiting
if (process.env["TRUST_PROXY"] === "true") {
  app.set("trust proxy", 1);
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"]?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);

// Logging middleware
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Rate limiting
app.use(rateLimiterMiddleware);

// Routes
app.use("/api/health", healthCheck);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/proxy", proxyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/ai", aiRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Connect to Redis
    await connectRedis();
    logger.info("Redis connected successfully");

    // Start server
    app.listen(PORT, () => {
      logger.info(`API Gateway running on port ${PORT}`);
      logger.info(`Environment: ${process.env["NODE_ENV"]}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`Auth Service: ${process.env["AUTH_SERVICE_URL"]}`);
      logger.info(`User Service: ${process.env["USER_SERVICE_URL"]}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
