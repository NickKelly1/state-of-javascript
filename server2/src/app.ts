import * as ts_node_remember_overrides from './custom';
import { GraphiQL } from 'graphiql/dist/';
import { GqlSchema } from './gql.schema';
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
import { modelsInit } from './models.init';
import { passportMw } from './common/middleware/passport.middleware';
import { handler } from './common/helpers/handler.helper';
import { delay } from './common/helpers/delay.helper';
import { permissionsInitialise } from './app/permission/permissions.initialise';
import { DbService } from './app/db/db.service';
import { QueryRunner } from './app/db/query-runner';
import { rolesInitialise } from './app/role/roles.initialise';
import { rolePermissionsInitialise } from './app/role-permission/role-permissions.initialise';
import { usersInitialise } from './app/user/users.initialise';
import { userRolesInitialise } from './app/user-role/user-roles.initialise';
import { ExecutionResult, graphql, GraphQLError, } from 'graphql';
import { GqlContext } from './common/classes/gql.context';
import { HttpCode } from './common/constants/http-code.const';
import { JsonResponder } from './common/responses/json.responder';
import { graphqlHTTP, OptionsData } from 'express-graphql';
import { GraphiQLData } from 'express-graphql/renderGraphiQL';
import { IncomingMessage, OutgoingMessage } from 'http';
import { mwGql } from './common/helpers/mw-gql.helper';
import { prettyQ } from './common/helpers/pretty.helper';
import { makeException } from './common/helpers/make-exception.helper';

export async function bootApp(arg: { env: EnvService }): Promise<ExpressContext> {
  const { env } = arg;
  logger.info('booting...');

  const sequelize = createSequelize({ env });

  try {
    // make sure db creds work...
    const auth = await sequelize.authenticate();
  } catch (error) {
    logger.debug('Failed to authenticate...');
    throw error;
  }

  modelsInit({ sequelize });

  // TODO: don't synchronise
  logger.info('syncing...')
  await sequelize.sync();

  // initialise domains
  await sequelize.transaction(async transaction => {
    const runner = new QueryRunner(transaction);
    logger.info('Initialising Permissions...');
    await permissionsInitialise({ env, runner });

    logger.info('Initialising Roles...');
    await rolesInitialise({ env, runner });

    logger.info('Initialising RolePermissions...');
    await rolePermissionsInitialise({ env, runner });

    logger.info('Initialising Users...');
    await usersInitialise({ env, runner });

    logger.info('Initialising UserRoles...');
    await userRolesInitialise({ env, runner });
  });


  const app = new ExpressContext({ root: express() });

  // app.use('/zing', handler(async ()))

  // app.use(function (req, res, next) {
  //   res.cookie(
  //     'fuckzaaa',
  //     'you',
  //     {
  //       maxAge: 10,
  //     },
  //   );
  //   next();
  //   // res
  //   //   .status(200)
  //   //   .contentType('json')
  //   //   .send(prettyQ(JSON.stringify({ hello: ':)' })));
  // });
  // app.use(cors({ origin: true, credentials: true }));
  // app.use(cors({
  //   origin: '*',
  //   credentials: true,
  // }));
  app.use(cors((req, done) => done(null, ({
    credentials: true,
    origin: req.headers.origin,
  }))));
  // app.use(function(req, res, next) {
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Allow-Origin', req.headers.origin);
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Set-Cookie');
  //   next();
  // });
  // app.use(cors({ origin: true, credentials: true }));
  app.use(handler(async (req, res, next) => {
    if (env.DELAY) await delay(env.DELAY);
    next();
  }));
  app.use(morgan('dev', { stream: loggerStream }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(servicesMw({ env, sequelize }));
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
