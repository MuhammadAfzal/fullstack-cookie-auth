import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// Log queries in development
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    logger.debug("Query: " + e.query);
    logger.debug("Params: " + e.params);
    logger.debug("Duration: " + e.duration + "ms");
  });
}

// Log errors
prisma.$on("error", (e) => {
  logger.error("Prisma Error:", e);
});

// Log info
prisma.$on("info", (e) => {
  logger.info("Prisma Info:", e);
});

// Log warnings
prisma.$on("warn", (e) => {
  logger.warn("Prisma Warning:", e);
});

async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
}

async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info("Database disconnected successfully");
  } catch (error) {
    logger.error("Database disconnection failed:", error);
    throw error;
  }
}

export { prisma, connectDatabase, disconnectDatabase };
