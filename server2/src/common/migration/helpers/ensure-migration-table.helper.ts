import { DataTypes, Model, QueryInterface, Sequelize, Transaction } from "sequelize";
import { ist } from "../../helpers/ist.helper";
import { logger } from "../../logger/logger";
import { created_at } from "../../schemas/constants/created_at.const";
import { updated_at } from "../../schemas/constants/updated_at.const";
import { _migrations } from "../constants/_migration.const";
import { IMigrationAttributes } from "../model/migraiton.attributes";


export async function ensureMigrationTable(arg: {
  transaction: Transaction;
  qInterface :QueryInterface;
  sequelize: Sequelize;
}): Promise<void> {
  const { transaction, qInterface, sequelize } = arg;

  // initialise in database
  const allTables = await qInterface.showAllTables({ transaction });
  const migrationsTable = allTables.find(table => table === _migrations);
  if (ist.nullable(migrationsTable)) {
    logger.info(`creating "${_migrations}" table...`);
    await qInterface.createTable<Model<IMigrationAttributes>>(
      { tableName: _migrations, },
      {
        id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER.UNSIGNED },
        path: { type: DataTypes.STRING(600), unique: true, allowNull: false },
        file: { type: DataTypes.STRING(300), unique: true, allowNull: false },
        number: { type: DataTypes.INTEGER, unique: true, allowNull: false },
        batch: { type: DataTypes.INTEGER, allowNull: false },
        [created_at]: { type: DataTypes.DATE, allowNull: false, },
        [updated_at]: { type: DataTypes.DATE, allowNull: false, },
      },
      { transaction, },
    );
  }
}