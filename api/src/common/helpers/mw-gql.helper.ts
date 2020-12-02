import { IRouterHandler, NextFunction, Request, RequestHandler, Response, Handler } from 'express';
import { OptionsData } from 'express-graphql';
import { ParamsDictionary, Query, } from 'express-serve-static-core';
import { IncomingMessage, OutgoingMessage } from 'http';
import { HttpContext } from '../context/http.context';
import { RequestAuth } from '../classes/request-auth';
import { $TS_FIX_ME } from '../types/$ts-fix-me.type';
import { handler } from './handler.helper';
import { ist } from './ist.helper';

export type IMwReturn = any;

export interface IMwGqlFn {
  (ctx: HttpContext): Promise<OptionsData>;
}

interface GraphQLAdaptedHandler {
  // => what express-gql expects
  // express-graphql wraps with try-catch
  (request: IncomingMessage, response: OutgoingMessage): Promise<OptionsData>;
}

// express-graphql thinks its using http IncomingMessage and OutgoingMessage
// this helper types as express Request and Response instead
// and also ensures http ctx
export const mwGql = (fn: IMwGqlFn): GraphQLAdaptedHandler => async (req, res): Promise<OptionsData> => {
  const http = HttpContext.ensure({
    req: req as Request,
    res: res as Response,
  });
  const result = await fn(http);
  return result;
};
