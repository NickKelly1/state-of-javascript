import { Handler, NextFunction, Request, Response } from "express";

export const handler = (fn: (req: Request, res: Response, next: NextFunction) => any): Handler => (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next)
  } catch (error) {
    next(error);
  }
}) as Handler;