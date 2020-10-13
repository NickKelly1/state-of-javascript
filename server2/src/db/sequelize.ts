import { Sequelize } from 'sequelize';
import { Env } from '../environment/env';

// export const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: Env.PG_HOST,
//   database: Env.PG_DB,
//   password: Env.PG_PSW,
//   username: Env.PG_USER,
// });
export const sequelize = new Sequelize('sqlite::memory', { logging: true });