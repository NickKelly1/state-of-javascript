import { NextFunction, Handler } from 'express';
import { HttpContext } from '../context/http.context';
import { handler } from './handler.helper';

export type IMwReturn = any;

export interface IMwFn<T = unknown> {
  (ctx: HttpContext, next: NextFunction): T | Promise<T>;
}

export const mw = <T = any>(fn: IMwFn<T>): Handler => handler(async (req, res, next) => {
  const ctx = HttpContext.ensure({ req, res });
  const result = await fn(ctx, next);
});
