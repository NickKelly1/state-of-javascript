import { Sequelize, } from 'sequelize';
import { EnvService } from '../../common/environment/env';
import { logger } from '../../common/logger/logger';


export function createSequelize(arg: { env: EnvService }): Sequelize {
  const { env } = arg;
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
