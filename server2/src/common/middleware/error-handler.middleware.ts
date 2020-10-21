import { ErrorRequestHandler, NextFunction, Request, Response, } from 'express';
import { HttpContext } from '../classes/http.context';
import { makeException } from '../helpers/make-exception.helper';
import { logger } from '../logger/logger';

export const errorHandlerMw = (): ErrorRequestHandler => ((err: any, req: Request, res: Response, next: NextFunction) => {
  const ctx = HttpContext.ensure({ req, res });
  const exception = makeException(ctx, err);
  if (exception.code === 500) { logger.error(exception.name, exception.toJsonDev()); }
  else { logger.warn(exception.name, exception.toJsonDev()); }
  res.status(exception.code);
  res.json(exception.toJson());
}) as ErrorRequestHandler;