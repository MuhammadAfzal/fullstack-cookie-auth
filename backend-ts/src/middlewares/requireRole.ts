import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../utils/AppError";

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // assumes JWT middleware already set this
    if (!user) throw new UnauthorizedError("Not authenticated");

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError("You do not have permission for this action");
    }

    next();
  };
}
