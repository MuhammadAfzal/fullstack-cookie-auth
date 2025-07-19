import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage =
          (error as any).errors?.map((err: any) => err.message)?.join(", ") ||
          "Validation failed";
        return res.status(400).json({
          success: false,
          error: errorMessage,
        });
      } else {
        next(error);
      }
    }
  };
};
