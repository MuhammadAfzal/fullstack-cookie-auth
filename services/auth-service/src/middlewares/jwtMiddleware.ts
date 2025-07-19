import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "@shared/common";
import { AuthenticationError } from "@shared/common";
import { createLogger } from "@shared/common";

const logger = createLogger("jwt-middleware");

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const SECRET = process.env.JWT_SECRET!;

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AuthenticationError("No token provided");
    }

    const decoded = jwt.verify(token, SECRET) as AuthUser;
    req.user = decoded;

    logger.debug("JWT token verified", {
      userId: decoded.id,
      username: decoded.username,
    });
    next();
  } catch (error) {
    logger.error("JWT verification failed", { error });
    next(new AuthenticationError("Invalid token"));
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn("Access denied", {
        userId: req.user.id,
        userRole: req.user.role,
        allowedRoles,
      });
      return next(new AuthenticationError("Insufficient permissions"));
    }

    next();
  };
};
