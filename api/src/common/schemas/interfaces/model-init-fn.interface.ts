import { Sequelize } from 'sequelize';
import { UniversalSerivceContainer } from '../../containers/universal.service.container';
import { EnvService } from '../../environment/env';

interface ModelInitFnArg { env: EnvService; sequelize: Sequelize; };

export interface ModelInitFn {
  (arg: ModelInitFnArg): void;
}