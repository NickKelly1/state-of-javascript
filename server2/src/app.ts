import express, { ErrorRequestHandler, Handler, IRouterHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import Debug from 'debug';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Routes } from './routes';
import { ExpressContext } from './common/classes/express-context';
import { mw } from './common/helpers/mw.helper';
import { $TS_DANGER } from './common/types/$ts-danger.type';
import { HttpContext } from './common/classes/http.context';
import { is } from './common/helpers/is.helper';
import { Env } from './environment/env';
import { InternalServerException } from './common/exceptions/types/internal-server.exception';
import { Dbg } from './dbg';
import { Sequelize } from 'sequelize';
import { sequelize } from './db/sequelize';
import { RequestAuth } from './common/classes/request-auth';
import { NotFoundException } from './common/exceptions/types/not-found.exception';
import { $TS_FIX_ME } from './common/types/$ts-fix-me.type';
import * as ts_node_remember_overrides from './custom';


export async function bootApp(): Promise<ExpressContext> {

  try {
    // make sure db creds work...
    const auth = await sequelize.authenticate();
  } catch (error) {
    Dbg.Db('Failed to authenticate...');
    throw error;
  }

  // TODO: don't synchronise
  console.log('syncing...')
  await sequelize.sync();

  const app = new ExpressContext({ root: express() });

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function wrapAuth(req: Request, res: Response, next: NextFunction) {
    // initialise req locals
    const auth = new RequestAuth();
    const http = HttpContext.create({ req, res });
    req.__locals__ = { auth, ctx: http };
    next();
  } as Handler);

  // routes...
  app.use(Routes({ app }));

  app.use(mw(async (ctx) => {
    throw ctx.except(NotFoundException());
  }));

  // error handler
  app.use((function handleError(err: any, req: Request, res: Response, next: NextFunction) {
    const http = HttpContext.create({ req, res });
    const exception = is.exception(err)
      ? err
      : http.except(InternalServerException({
        debug: is.obj(err)
          ? err instanceof Error
            ? { name: err.name, message: err.message, stack: err.stack?.split('\n') }
            : { ...err }
          : err
        }));
    res.status(exception.code);
    res.json(exception.toJson());
  }) as $TS_FIX_ME<ErrorRequestHandler>);

  return app;
}
