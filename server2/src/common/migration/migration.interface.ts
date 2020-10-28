import { QueryInterface, Sequelize, Transaction } from "sequelize";

export interface IMigration {
  tag: string;
  up: (queryInterface: QueryInterface, transaction: Transaction, sequelize: Sequelize) => Promise<void>;
  down: (queryInterface: QueryInterface, transaction: Transaction, sequelize: Sequelize) => Promise<void>;
}