import { NextFunction } from 'express';
import { HttpContext } from '@src/classes/http.context';
import { ExecutionContext } from '@src/classes/execution-context';
import { IException } from '@src/interfaces/exception.interface';
import { IMiddleware } from '@src/interfaces/middleware.interface';

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
