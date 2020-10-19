import { ErrorRequestHandler, Handler, NextFunction, Request, Response, } from 'express';
import { HttpContext } from '../classes/http.context';
import { InternalServerException } from '../exceptions/types/internal-server.exception';
import { ist } from '../helpers/is.helper';
import { logger } from '../logger/logger';

export const errorHandlerMw = (): ErrorRequestHandler => ((err: any, req: Request, res: Response, next: NextFunction) => {
  const ctx = HttpContext.ensure({ req, res });
  const exception = ist.exception(err)
    ? err
    : ctx.except(InternalServerException({
      debug: ist.obj(err)
        ? err instanceof Error
          ? { name: err.name, message: err.message, stack: err.stack?.split('\n') }
          : { ...err }
        : err
      }));

  if (exception.code === 500) {
    logger.error(exception.name, exception.toJsonDev());
  } else {
    logger.warn(exception.name, exception.toJsonDev());
  }

  res.status(exception.code);
  res.json(exception.toJson());
}) as ErrorRequestHandler;