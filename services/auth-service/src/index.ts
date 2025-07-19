import express from "express";
import dotenv from "dotenv";
import path from "path";
import {
  securityMiddleware,
  commonMiddleware,
  errorHandler,
  notFoundHandler,
  healthCheck,
} from "@shared/common";
import { createLogger } from "@shared/common";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5001;
const logger = createLogger("auth-service");

// Middleware
app.use(securityMiddleware);
app.use(commonMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", healthCheck("auth-service"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Auth service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
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
