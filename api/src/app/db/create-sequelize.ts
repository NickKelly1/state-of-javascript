import { Sequelize, } from 'sequelize';
import { EnvService } from '../../common/environment/env';
import { logger } from '../../common/logger/logger';


export function createSequelize(arg: { env: EnvService }): Sequelize {
  const { env } = arg;
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: env.POSTGRES_HOST,
    database: env.POSTGRES_DATABASE,
    password: env.POSTGRES_PASSWORD,
    username: env.POSTGRES_USER,
    logging: (sql) => { logger.info(`sql: ${sql}`) }, // logger.info(pretty({ timing, sql })),
  });

  return sequelize;
}
