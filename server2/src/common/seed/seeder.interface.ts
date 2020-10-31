import { QueryInterface, Sequelize, Transaction } from "sequelize";
import { EnvService } from "../environment/env";
import { IRequestContext } from "../interfaces/request-context.interface";

export interface ISeederArg {
  ctx: IRequestContext,
  queryInterface: QueryInterface;
  transaction: Transaction;
  sequelize: Sequelize;
  env: EnvService;
}

export interface ISeeder {
  tag: string;
  run: (arg: ISeederArg) => Promise<void>;
}