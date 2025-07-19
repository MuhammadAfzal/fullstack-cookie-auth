import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { config } from "dotenv";
import { logger } from "./utils/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { rateLimiter } from "./middlewares/rateLimiter";
import { healthCheck } from "./routes/healthRoutes";
import { userRoutes } from "./routes/userRoutes";
import { profileRoutes } from "./routes/profileRoutes";
import { connectionRoutes } from "./routes/connectionRoutes";
import { activityRoutes } from "./routes/activityRoutes";
import { postRoutes } from "./routes/postRoutes";
import { commentRoutes } from "./routes/commentRoutes";
import { uploadRoutes } from "./routes/uploadRoutes";
import { connectDatabase } from "./utils/database";
import { connectRedis } from "./utils/redis";

// Load environment variables
config();

const app = express();
const PORT = process.env["PORT"] || 3002;

// Middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"]?.split(",") || ["http://localhost:3000"],
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

// Rate limiting
app.use(rateLimiter);

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/health", healthCheck);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/uploads", uploadRoutes);

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
    // Connect to database
    await connectDatabase();
    logger.info("Database connected successfully");

    // Connect to Redis
    await connectRedis();
    logger.info("Redis connected successfully");

    // Start server
    app.listen(PORT, () => {
      logger.info(`User Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env["NODE_ENV"]}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
