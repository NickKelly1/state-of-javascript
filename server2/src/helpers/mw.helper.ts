import { NextFunction } from 'express';
import { HttpContext } from '../classes/http.context';
import { IMiddleware } from '../interfaces/middleware.interface';

export type IMwReturn = any;

export interface IMwFn {
  (ctx: HttpContext, next: NextFunction): IMwReturn;
}

export function mw<T>(fn: IMwFn): IMiddleware {
  return async function wrappedMw(req, res, next) {
    const ctx = HttpContext.bindHttp({ req, res });
    try {
      await fn(ctx, next);
    } catch (error) {
      next(error);
    }
  }
}
