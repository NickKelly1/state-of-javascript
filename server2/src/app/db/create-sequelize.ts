import { Sequelize } from 'sequelize';
import { EnvService } from '../../common/environment/env';
import { pretty } from '../../common/helpers/pretty.helper';
import { logger } from '../../common/logger/logger';

// export const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: Env.PG_HOST,
//   database: Env.PG_DB,
//   password: Env.PG_PSW,
//   username: Env.PG_USER,
// });

// const sequelize = new Sequelize('sqlite::memory', {
//   logging: (sql) => { logger.info(`sql: ${sql}`) }, // logger.info(pretty({ timing, sql })),
//   // logging: false,
// });

export function createSequelize(arg: { env: EnvService }): Sequelize {
  const { env } = arg;
  // const sequelize = new Sequelize('sqlite::memory', {
  //   logging: (sql) => { logger.info(`sql: ${sql}`) }, // logger.info(pretty({ timing, sql })),
  //   // logging: false,
  // });
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: env.PG_HOST,
    database: env.PG_DB,
    password: env.PG_PSW,
    username: env.PG_USER,
    logging: (sql) => { logger.info(`sql: ${sql}`) }, // logger.info(pretty({ timing, sql })),
  });

  return sequelize;
}
// // access EnvService globally...
// export const sequelize = new Sequelize('sqlite::memory', {
//   logging: (sql) => { logger.info(`sql: ${sql}`) }, // logger.info(pretty({ timing, sql })),
//   // logging: false,
// });