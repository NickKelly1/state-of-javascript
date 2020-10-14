import { Sequelize } from 'sequelize';

export interface ModelInitFn {
  (arg: { sequelize: Sequelize }): void;
}