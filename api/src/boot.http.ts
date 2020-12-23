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

export async function bootHttp(arg: { universal: IUniversalServices, }): Promise<void> {
  const { universal, } = arg;
  const { app } = universal;

  // socketio

  // https://www.npmjs.com/package/morgan
  // app.use(morgan('dev', { stream: loggerStream }));
  morgan.token('user_id', (req: Request) => req.__locals__?.auth?.user_id?.toString() ?? '_');
  morgan.token('aid', (req: Request) => req.__locals__?.auth?.aid ?? '_');
  if (universal.env.LOG_HTTP_HEADERS) {
    morgan.token('headers', (req: Request) => prettyQ(req.headers));
    app.use(morgan(
      `:remote-addr :method :url :status :response-time ms - :res[content-length] - user_id=:user_id - aid=:aid - headers=:headers`,
      { stream: loggerStream }),
    );
  } else {
    morgan.token('headers', (req: Request) => prettyQ(req.headers));
    app.use(morgan(
      `:remote-addr :method :url :status :response-time ms - :res[content-length] - user_id=:user_id - aid=:aid`,
      { stream: loggerStream }),
    );
  }
  // TODO: restrict cors...
  // TODO: only allow cors @ specific origins...
  app.use(cors((req, done) => done(null, ({ credentials: true, origin: req.headers.origin, }))));
  if (universal.env.DELAY) {
    app.use(handler(async (req, res, next) => {
      if (universal.env.DELAY) await delay(universal.env.DELAY);
      next();
    }));
  }
  // rate limit
  app.use(rateLimit({
    windowMs: universal.env.RATE_LIMIT_WINDOW_MS,
    max: universal.env.RATE_LIMIT_MAX,
    // handler: (req, res, next) => next(new TooManyRequestsException()),
    handler: (req, res, next) => next(exceptionToJson(new TooManyRequestsException())),
  }));
  // gzip
  app.use(compression());
  // parse json
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // parse cookies
  app.use(cookieParser());
  // serve static from public
  // don't require .html
  app.use(express.static(path.join(ROOT_DIR, './public'), { extensions: ['html']}));

  app.use(servicesMw({ universal }));
  app.use(passportMw());

  const gqlMiddleware = graphqlHTTP((req, res) => {
    const ctx = GqlContext.createFromHttp({ req: req as Request, res: res as Response, });
    return {
      schema: GqlSchema,
      context: ctx,

      // extensions...
      async extensions(info) {
        const result = {
          date: new Date(),
          user_id: ctx.auth.user_id ?? null,
          aid: ctx.auth.aid ?? null,
          ...info.result.extensions,
          exception: info.result.extensions?.exception
            ? exceptionToJson(info.result.extensions.exception)
            : undefined,
        };
        return result;
      },

      // error formatting...
      customFormatErrorFn(originalGraphQLError): GraphQLError {
        const original = originalGraphQLError.originalError;
        if (!original) return originalGraphQLError;
        const path = originalGraphQLError.path;
        logger.error(`GraphQL Error (original): ${prettyQ({
          path,
          original,
        })}`);
        let exception: httpErrors.HttpError;
        if (original instanceof httpErrors.HttpError) { exception = original; }
        else { exception = new httpErrors.InternalServerError(); }
        // clone the GraphQL error but add the exception as an extension...
        const updatedGraphQLError = new GraphQLError(
          originalGraphQLError.message,
          originalGraphQLError.nodes,
          originalGraphQLError.source,
          originalGraphQLError.positions,
          originalGraphQLError.path,
          originalGraphQLError.originalError,
          {
            ...originalGraphQLError.extensions,
            exception: exceptionToJson(exception),
          },
        );
        return updatedGraphQLError;
      },
    };
  });

  // serve graphql on the primary gql route
  app.use('/v1/gql', gqlMiddleware);
  // also serve graphql on the refresh_token route...
  // refresh_token cookie is scoped to this
  app.use('/refresh/v1/gql', gqlMiddleware);

  app.use(Routes({ app }));

  // health check
  app.get('/_health', (req, res) => res.status(200).json({
    message: 'Okay :)',
    date: new Date().toISOString(),
  }));

  // not found...
  app.use(mw(async (ctx, next) => next(new NotFoundException(ctx.lang(ExceptionLang.PathNotFound({ path: ctx.req.path }))))));

  app.use(errorHandlerMw());
}
