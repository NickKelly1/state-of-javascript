import { IRouterHandler, NextFunction, Request, RequestHandler, Response, Handler } from 'express';
import { ParamsDictionary, Query, } from 'express-serve-static-core';
import { HttpContext } from '../classes/http.context';
import { RequestAuth } from '../classes/request-auth';
import { $TS_FIX_ME } from '../types/$ts-fix-me.type';
import { handler } from './handler.helper';
import { ist } from './ist.helper';
import { isu } from './isu.helper';

export type IMwReturn = any;

export interface IMwFn<T> {
  (ctx: HttpContext, next: NextFunction): T | Promise<T>;
}

export const mw = <T = any>(fn: IMwFn<T>): Handler => handler(async (req, res, next) => {
  const ctx = HttpContext.ensure({ req, res });
  const result = await fn(ctx, next);
  if (isu.responder(result)) result.respond(res);
});
