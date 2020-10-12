import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): any;
}