import * as overrides from './custom';
import { GqlSchema } from './gql.schema';
import * as cron from 'cron';
import Bull, { DoneCallback, Job, ProcessCallbackFunction, ProcessPromiseFunction } from 'bull';
import express, { Handler, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { Routes } from './routes';
import { ExpressContext } from './common/classes/express-context';
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
import { ExecutionResult, graphql, GraphQLError, } from 'graphql';
import { graphqlHTTP, OptionsData } from 'express-graphql';
import { mwGql } from './common/helpers/mw-gql.helper';
import { makeException } from './common/helpers/make-exception.helper';
import { ScriptGuard } from './script-guard';
import { prettyQ } from './common/helpers/pretty.helper';
import { universalServiceContainerFactory } from './common/containers/universal.service.container.factory';
import { GqlContext } from './common/context/gql.context';
import { IGoogleIntegrationServiceSendEmailDto } from './app/google/dtos/google.service.send-email-dto';
import { Integration } from './app/integration/integration.const';
import { JobRunnerFactory } from './common/helpers/jb.helper';
import { ist } from './common/helpers/ist.helper';
import { InternalServerException } from './common/exceptions/types/internal-server.exception';
import { BadRequestException } from './common/exceptions/types/bad-request.exception';
import { Exception, IApiException } from './common/exceptions/exception';
import { IExceptionData } from './common/interfaces/exception-data.interface';
import { Printable } from './common/types/printable.type';
import { CronTickHandlerFactory, ICronTickHandlerFnArg } from './common/helpers/cron-tick-handler.helper';
import { Op } from 'sequelize/types';
import { NpmsPackageField } from './app/npms-package/npms-package.attributes';

export async function bootApp(arg: { env: EnvService }): Promise<ExpressContext> {
  const { env } = arg;
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
          // const yesterday = new Date(Date.now() - 1_000 * 60 * 60 * 24);
          const threeMinutesAgo = new Date(Date.now() - 1_000 * 60 * 3);
          await ctx.services.npmsPackageService.synchronise({
            runner,
            since: threeMinutesAgo,
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

  const app = new ExpressContext({ root: express() });

  // TODO: only allow cors @ specific origins...
  app.use(cors((req, done) => done(null, ({
    credentials: true,
    origin: req.headers.origin,
  }))));
  app.use(handler(async (req, res, next) => {
    if (env.DELAY) await delay(env.DELAY);
    next();
  }));
  app.use(morgan('dev', { stream: loggerStream }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(servicesMw({ universal }));
  app.use(passportMw());

  const gqlMiddleware = graphqlHTTP(mwGql(async (ctx): Promise<OptionsData> => {
    const { req, res } = ctx;
    const gql = GqlContext.createFromHttp({ req, res, });
    const data: OptionsData = {
      customFormatErrorFn: (err) => {
        logger.error(`Error in GraphQL: ${prettyQ(err)}`);
        let exception: Exception;

        if (ist.nullable(err.originalError)) {
          // probably a GraphQL error
          const message: string = String(err.message);
          const error = 'GraphQLError';
          const data: IExceptionData = {
            locations: err.locations ? err.locations.map(loc => `line: ${loc.line}, column: ${loc.column}`) : undefined,
            positions: err.positions ? err.positions.map(String) : undefined,
            path: err.path ? err.path.map(String) : undefined,
          };
          const debug: Printable = {
            source: err.source,
            name: err.name,
          }
          exception = ctx.except(BadRequestException({
            error,
            message,
            data,
            debug,
          }));
        } else {
          exception = makeException(ctx, err.originalError);
          if (exception.code === 500) { logger.error(exception.name, exception.toJsonDev()); }
          else { logger.warn(exception.name, exception.toJsonDev()); }
        }

        const modifiedError = new GraphQLError(
          err.message,
          err.nodes,
          err.source,
          err.positions,
          err.path,
          err.originalError,
          { ...err.extensions, exception: exception.toJson() },
        );
        return modifiedError;
      },
      schema: GqlSchema,
      context: gql,
      graphiql: true,
    };
    return data;
  }));

  // serve graphql on the primary gql route
  app.use('/v1/gql', gqlMiddleware);
  // also serve graphql on the refresh_token route...
  // refresh_token cookie is scoped to this
  app.use('/refresh/v1/gql', gqlMiddleware);

  app.use(Routes({ app }));
  app.use(mw(async (ctx) => { throw ctx.except(NotFoundException()); }));
  app.use(errorHandlerMw());

  return app;
}
