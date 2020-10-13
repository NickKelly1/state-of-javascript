import { IRouterHandler, NextFunction, Request, RequestHandler, Response, Handler } from 'express';
import { ParamsDictionary, Query, } from 'express-serve-static-core';
import { HttpContext } from '../classes/http.context';
import { RequestAuth } from '../classes/request-auth';
import { $TS_FIX_ME } from '../types/$ts-fix-me.type';

export type IMwReturn = any;

export interface IMwFn {
  (ctx: HttpContext, next: NextFunction): IMwReturn;
}

export function mw(fn: IMwFn): Handler {
  const wrappedMw = async (req: Request, res: Response, next: NextFunction) => {
    const { ctx } = req.__locals__;
    try {
      await fn(ctx, next);
    } catch (error) {
      next(error);
    }
  };

  return wrappedMw as $TS_FIX_ME<Handler>;
}

