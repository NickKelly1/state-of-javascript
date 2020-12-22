// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as overrides from './custom';
import rateLimit from 'express-rate-limit';
import { GqlSchema } from './gql.schema';
import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { Routes } from './routes';
import { mw } from './common/helpers/mw.helper';
import { NotFoundException } from './common/exceptions/types/not-found.exception';
import { TooManyRequestsException } from './common/exceptions/types/too-many-requests.exception';
import { logger, loggerStream } from './common/logger/logger';
import { servicesMw } from './common/middleware/services.middleware';
import { errorHandlerMw } from './common/middleware/error-handler.middleware';
import { passportMw } from './common/middleware/passport.middleware';
import { handler } from './common/helpers/handler.helper';
import { delay } from './common/helpers/delay.helper';
import { graphqlHTTP } from 'express-graphql';
import { prettyQ } from './common/helpers/pretty.helper';
import { GqlContext } from './common/context/gql.context';
import { ROOT_DIR } from './root';
import compression from 'compression';
import { ExceptionLang } from './common/i18n/packs/exception.lang';
import httpErrors from 'http-errors';
import { GraphQLError } from 'graphql';
import { exceptionToJson } from './common/helpers/exception-to-json.helper';
import { IUniversalServices } from './common/interfaces/universal.services.interface';

export async function bootWs(arg: { universal: IUniversalServices }): Promise<void> {
  const { universal } = arg;
  const { io } = universal;


  let count = 0;
  io.on('connection', (socket) => {
    console.log('New client connected...');
    count += 1;
    logger.info(`[Socket::${socket.id}] Socket ${count} connected...`);
    socket.on('disconnect', () => {
      logger.info(`[Socket::${socket.id}] Socket ${count} disconnected...`);
      count -= 1;
    });
    socket.on('message', (message: string) => {
      logger.info(`[Socket::${socket.id}::message] ${message}`);
      if (message === 'PING') { socket.send('PONG') }
    });
  });

  // // TODO: authorisation...
  // io.use((socket, next) => {
  //   count += 1;
  //   logger.info(`[Socket::${socket.id}] Socket ${count} connected...`);
  //   socket.on('disconnect', () => {
  //     logger.info(`[Socket::${socket.id}] Socket ${count} disconnected...`);
  //     count -= 1;
  //   });
  //   socket.on('message', (message) => {
  //     logger.info(`[Socket::${socket.id}::message] ${message}`);
  //     if (message === 'PING') { socket.send('PONG') }
  //   });
  // });

  // //
}
