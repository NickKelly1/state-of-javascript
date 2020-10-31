import { GqlSchema } from './gql.schema';
import * as overrides from './custom';
import Bull, { DoneCallback, Job } from 'bull';
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
import { npmsApiFactory } from './app/npms-package/api/npms-api.factory';

export async function bootApp(arg: { env: EnvService }): Promise<ExpressContext> {
  const { env } = arg;
  logger.info('booting...');

  const sequelize = createSequelize({ env });
  await initialiseDb({ sequelize, env });
  const universal = universalServiceContainerFactory({ env, sequelize });

  // block scripts from accidentally firing
  // might save your life in production if something dumb happens...
  ScriptGuard.setNo();
  const queue = new Bull('my-first-queue', {
    // limiter: {
    //   duration: 5,
    //   max: 5,
    //   bounceBack: true,
    //   groupKey: '_k',
    // },
    // defaultJobOptions: {
    //   attempts: 5,
    //   backoff: 5,
    //   delay: 5,
    //   jobId: '5',
    //   lifo: true,
    //   priority: 5,
    //   preventParsingData: true,
    //   removeOnComplete: true,
    //   removeOnFail: true,
    //   repeat: { cron: '* * * * *' },
    //   // stackTraceLimit: true,
    //   stackTraceLimit: 5,
    //   timeout: 500,
    // },
    // prefix: '_pfx',
    // settings: {
    //   backoffStrategies: { _test_: (attempts: number, err: Error) => 5, },
    //   drainDelay: 5,
    //   guardInterval: 5,
    //   lockDuration: 5,
    //   lockRenewTime: 5,
    //   maxStalledCount: 5,
    //   retryProcessDelay: 5,
    //   stalledInterval: 5,
    // },
    // redis: {
    //   autoResendUnfulfilledCommands: true,
    //   autoResubscribe: true,
    //   connectTimeout: 500,
    //   connectionName: '__queue__conn__',
    //   db: 5,
    //   dropBufferSupport: true,
    //   enableOfflineQueue: true,
    //   enableReadyCheck: true,
    //   enableTLSForSentinelMode: true,
    //   family: 5,
    //   host: 'localhost',
    //   keepAlive: 5,
    //   keyPrefix: '__key__',
    //   lazyConnect: true,
    //   maxRetriesPerRequest: 5,
    //   name: '__name__',
    //   port: 6379,
    //   path: '/path',
    //   username: '__redis__usrname__',
    // },
    redis: {
      password: env.REDIS_PSW,
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
  });

  // interface IJobFnArg {
  //   ctx: SystemContext;
  // }

  // function jb<T>() {
  //   //
  // } 
  // try {
  //   //
  // }

  interface INpmStatsJobData {
    names: string[];
  }

  const npmsQueue = new Bull<INpmStatsJobData>(
    'npms-stats',
    {
      redis: {
        password: env.REDIS_PSW,
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    },
  );

  npmsQueue.process(async (job, done) => {
    logger.debug(`npmsQueue: ${prettyQ(job.data)}`);
    // const records = await universal.npmsApi.packageInfos({ names: job.data.names });
    done();
  });

  npmsQueue.add({ names: ['sequelize'], });

  npmsQueue.process('image', async (job, done) => {
    done();
  });

  queue.process(async (job: Job<null>, done: DoneCallback) => {
    logger.info(`procesing job... ${prettyQ(job.id)} - ${prettyQ(await job.getState())} - ${prettyQ(job.data)}`);
    done();
  });

  setInterval(() => {
    logger.info('adding job...');
    queue.add(null);
  }, 5000);

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
  app.use('/v1/graphql', graphqlHTTP(mwGql(async (ctx): Promise<OptionsData> => {
    const { req, res } = ctx;
    const gql = GqlContext.create({ req, res, });
    const data: OptionsData = {
      customFormatErrorFn: (error) => {
        const exception = makeException(ctx, error.originalError);

        if (exception.code === 500) { logger.error(exception.name, exception.toJsonDev()); }
        else { logger.warn(exception.name, exception.toJsonDev()); }

        const modifiedError = new GraphQLError(
          error.message,
          error.nodes,
          error.source,
          error.positions,
          error.path,
          error.originalError,
          { ...error.extensions, exception: exception.toJson() },
        );
        return modifiedError;
      },
      schema: GqlSchema,
      context: gql,
      graphiql: true,
    };
    return data;
  })));
  app.use(Routes({ app }));
  app.use('/zing', mw((ctx, next) => {
    const { req, res } = ctx;

    const html = /* html */ `
    <html>
      <head>
        <title>
          The Title
        </title>
      </head>
      <body>
        <div>
          hoe hoe hoe
        </div>
      </body>
    </htm>
    `;

    res
      .status(200)
      .contentType('html')
      .send(html);
  }));
  app.use(mw(async (ctx) => { throw ctx.except(NotFoundException()); }));
  app.use(errorHandlerMw());

  return app;
}
