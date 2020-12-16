import { ErrorRequestHandler, NextFunction, Request, Response, } from 'express';
import { HttpContext } from '../context/http.context';
import { logger } from '../logger/logger';
import httpErrors from 'http-errors';
import { ExceptionLang } from '../i18n/packs/exception.lang';
import { prettyQ } from '../helpers/pretty.helper';
import { exceptionToJson } from '../helpers/exception-to-json.helper';


export const errorHandlerMw = (): ErrorRequestHandler => ((err: any, req: Request, res: Response, next: NextFunction) => {
  const ctx = HttpContext.ensure({ req, res });
  let exception: httpErrors.HttpError;
  if (err instanceof httpErrors.HttpError) {
    exception = err;
    logger.error(`Http Error: ${prettyQ(exception)}`);
    res
      .status(exception.statusCode)
      .json(exceptionToJson(exception));
    return undefined;
  }

  logger.error(`Unknown Http Error: ${prettyQ(err)}`);
  const message = ctx.lang(ExceptionLang.InternalException);
  exception = new httpErrors.InternalServerError(message);
  res
    .status(exception.statusCode)
    .json(exceptionToJson(exception));
}) as ErrorRequestHandler;