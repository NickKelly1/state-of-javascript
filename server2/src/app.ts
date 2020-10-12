import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Routes } from './routes';
import { ExpressContext } from './classes/express-context';
import { NotFoundException } from './exceptions/not-found.exception';
import { mw } from './helpers/mw.helper';
import { $TS_DANGER } from './types/$ts-danger.type';
import { HttpContext } from './classes/http.context';
import { is } from './helpers/is.helper';
import { Env } from './env';
import { IException } from './interfaces/exception.interface';
import { InternalServerException } from './exceptions/internal-server.exception';

export const app = new ExpressContext({ root: express() });

app.root.use(logger('dev'));
app.root.use(express.json());
app.root.use(express.urlencoded({ extended: false }));
app.root.use(cookieParser());
app.root.use(express.static(path.join(__dirname, 'public')));

// routes...
app.root.use(Routes({ app }));

app.root.use(mw(async (http, next) => {
  http.throw(NotFoundException.http());
}));

// error handler
app.root.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
  const http = HttpContext.bindHttp({ req, res });
  const exception = is.exception(err)
    ? err
    : new InternalServerException(http.execution, {});
  res.status(exception.code);
  res.json(exception.toJson());
});

