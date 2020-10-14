import { IRouterHandler, NextFunction, Request, RequestHandler, Response, Handler } from 'express';
import { ParamsDictionary, Query, } from 'express-serve-static-core';
import { HttpContext } from '../classes/http.context';
import { RequestAuth } from '../classes/request-auth';
import { $TS_FIX_ME } from '../types/$ts-fix-me.type';
import { handler } from './handler.helper';

export type IMwReturn = any;

export interface IMwFn {
  (ctx: HttpContext, next: NextFunction): IMwReturn;
}

export const mw = (fn: IMwFn): Handler => handler(async (req, res, next) => {
  const { ctx } = req.__locals__;
  await fn(ctx, next);
});

