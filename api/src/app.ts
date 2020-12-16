import * as overrides from './custom';
import rateLimit from 'express-rate-limit';
import { GqlSchema } from './gql.schema';
import * as cron from 'cron';
import express, { Request, Response, Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { Routes } from './routes';
import { mw } from './common/helpers/mw.helper';
import { EnvService } from './common/environment/env';
import { createSequelize, } from './app/db/create-sequelize';
import { NotFoundException } from './common/exceptions/types/not-found.exception';
import { logger, loggerStream } from './common/logger/logger';
import { servicesMw } from './common/middleware/services.middleware';
import { errorHandlerMw } from './common/middleware/error-handler.middleware';
import { initialiseDb } from './initialise-db';
import { passportMw } from './common/middleware/passport.middleware';
import { handler } from './common/helpers/handler.helper';
import { delay } from './common/helpers/delay.helper';
import { graphqlHTTP } from 'express-graphql';
import { ScriptGuard } from './script-guard';
import { prettyQ } from './common/helpers/pretty.helper';
import { universalServiceContainerFactory } from './common/containers/universal.service.container.factory';
import { GqlContext } from './common/context/gql.context';
import { IGoogleIntegrationServiceSendEmailDto } from './app/google/dtos/google.service.send-email-dto';
import { Integration } from './app/integration/integration.const';
import { JobRunnerFactory } from './common/helpers/jb.helper';
import { CronTickHandlerFactory, ICronTickHandlerFnArg } from './common/helpers/cron-tick-handler.helper';
import { ROOT_DIR } from './root';
import compression from 'compression';
import { ExceptionLang } from './common/i18n/packs/exception.lang';
import httpErrors from 'http-errors';
import { GraphQLError } from 'graphql';
import { exceptionToJson } from './common/helpers/exception-to-json.helper';

export async function bootApp(arg: { env: EnvService, app: Express }): Promise<Express> {
  const { env, app } = arg;
  logger.info('booting...');

  const sequelize = createSequelize({ env });
  await initialiseDb({ sequelize, env });
  const universal = universalServiceContainerFactory({ env, sequelize });

  // block scripts from accidentally firing
  // might save your life in production if something dumb happens...
  ScriptGuard.setNo();

  // TODO: put job runner somewhere else...
  const jr = JobRunnerFactory(universal);
  universal.gmailQueue.process(jr(async ({ ctx, job }) => {
    logger.info(`Processing gmail:\n${prettyQ(job.data)}`);
    await ctx.services.universal.db.transact(async ({ runner }) => {
      const serviceDto: IGoogleIntegrationServiceSendEmailDto = {
        to: job.data.to,
        body: job.data.body,
        subject: job.data.subject,
        cc: job.data.cc,
      };
      const model = await ctx
        .services
        .integrationRepository
        .findByPkOrfail(Integration.Google, { runner, });
      const result = await ctx.services.googleService.sendEmail({
        runner,
        dto: serviceDto,
        model,
      });
    });
  }));


  if (env.MASTER) {
    const onTick = CronTickHandlerFactory(universal);

    const job = new cron.CronJob(
      '* * * * *',
      onTick(async ({ ctx }: ICronTickHandlerFnArg) => {
        logger.info('Updating old npms packages...');
        ctx.services.universal.db.transact(async ({ runner }) => {
          // find all that haven't been checked in the last day...
          const yesterday = new Date(Date.now() - 1_000 * 60 * 60 * 24);
          // const threeMinutesAgo = new Date(Date.now() - 1_000 * 60 * 3);
          await ctx.services.npmsPackageService.synchronise({
            runner,
            since: yesterday,
          });
        });
      }),
      function onComplete() {
        //
      },
      true,
      'UTC',
    );

    job.start();
  }

  // https://www.npmjs.com/package/morgan
  // app.use(morgan('dev', { stream: loggerStream }));
  morgan.token('user_id', (req: Request, res: Response) => req.__locals__?.auth?.user_id?.toString() ?? '_');
  morgan.token('shadow_id', (req: Request, res: Response) => req.__locals__?.auth?.shadow_id ?? '_');
  if (env.LOG_HTTP_HEADERS) {
    morgan.token('headers', (req: Request, res: Response) => prettyQ(req.headers));
    app.use(morgan(
      `:remote-addr :method :url :status :response-time ms - :res[content-length] - user_id=:user_id - shadow_id=:shadow_id - headers=:headers`,
      { stream: loggerStream }),
    );
  } else {
    morgan.token('headers', (req: Request, res: Response) => prettyQ(req.headers));
    app.use(morgan(
      `:remote-addr :method :url :status :response-time ms - :res[content-length] - user_id=:user_id - shadow_id=:shadow_id`,
      { stream: loggerStream }),
    );
  }
  // TODO: restrict cors...
  // TODO: only allow cors @ specific origins...
  app.use(cors((req, done) => done(null, ({ credentials: true, origin: req.headers.origin, }))));
  if (env.DELAY) {
    app.use(handler(async (req, res, next) => {
      if (env.DELAY) await delay(env.DELAY);
      next();
    }));
  }
  // rate limit
  app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, max: env.RATE_LIMIT_MAX, }));
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

  // // TODO: clean this up & make errors nicer...
  // const gqlMiddleware = graphqlHTTP(mwGql(async (ctx): Promise<OptionsData> => {
  //   const { req, res } = ctx;
  //   const gql = GqlContext.createFromHttp({ req, res, });
  //   const data: OptionsData = {
  //     customFormatErrorFn: (err) => {
  //       logger.error(`Error in GraphQL: ${prettyQ(err)}`);
  //       let exception: Exception;

  //       if (ist.nullable(err.originalError)) {
  //         // probably a GraphQL error
  //         const message: string = String(err.message);
  //         const error = 'GraphQLError';
  //         const data: IExceptionData = {
  //           locations: err.locations ? err.locations.map(loc => `line: ${loc.line}, column: ${loc.column}`) : undefined,
  //           positions: err.positions ? err.positions.map(String) : undefined,
  //           path: err.path ? err.path.map(String) : undefined,
  //         };
  //         const debug: Printable = {
  //           source: err.source,
  //           name: err.name,
  //         }
  //         exception = ctx.except(BadRequestException({
  //           error,
  //           message,
  //           data,
  //           debug,
  //         }));
  //       } else {
  //         exception = makeException(ctx, err.originalError);
  //         if (exception.code === 500) { logger.error(exception.name, exception.toJsonDev()); }
  //         else { logger.warn(exception.name, exception.toJsonDev()); }
  //       }

  //       const modifiedError = new GraphQLError(
  //         err.message,
  //         err.nodes,
  //         err.source,
  //         err.positions,
  //         err.path,
  //         err.originalError,
  //         { ...err.extensions, exception: exception.toJson() },
  //       );
  //       return modifiedError;
  //     },
  //     schema: GqlSchema,
  //     context: gql,
  //     graphiql: false,
  //   };
  //   return data;
  // }));
  const gqlMiddleware = graphqlHTTP((req, res) => {
    const ctx = GqlContext.createFromHttp({ req: req as Request, res: res as Response, });
    return {
      schema: GqlSchema,
      context: ctx,

      // extensions...
      async extensions(info) {
        const result = {
          date: new Date(),
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
        logger.error(`GraphQL Error (original): ${prettyQ(original)}`);
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

  return app;
}
