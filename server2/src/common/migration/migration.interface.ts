import { QueryInterface, Sequelize, Transaction } from "sequelize";
import { EnvService } from "../environment/env";

export interface IMigrationUpArg {
  queryInterface: QueryInterface;
  transaction: Transaction;
  sequelize: Sequelize;
  env: EnvService;
}

export interface IMigrationDownArg {
  queryInterface: QueryInterface;
  transaction: Transaction;
  sequelize: Sequelize;
  env: EnvService;
}

export interface IMigration {
  tag: string;

  up: (arg: IMigrationUpArg) => Promise<void>;

  down: (arg: IMigrationDownArg) => Promise<void>;
}