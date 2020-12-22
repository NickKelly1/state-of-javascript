import { QueryInterface, Sequelize, Transaction } from "sequelize";
import { BaseContext } from "../context/base.context";
import { EnvService } from "../environment/env";

export interface ISeederArg {
  ctx: BaseContext;
  queryInterface: QueryInterface;
  transaction: Transaction;
  sequelize: Sequelize;
  env: EnvService;
}

export interface ISeeder {
  tag: string;
  run: (arg: ISeederArg) => Promise<void>;
}