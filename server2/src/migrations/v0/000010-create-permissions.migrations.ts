import { QueryInterface, Sequelize, DataTypes, Transaction } from "sequelize";
import { IMigration } from "../../common/migration/interfaces/migration.interface";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (qInterface: QueryInterface, transaction: Transaction, sequelize: Sequelize) => {
    await qInterface.createTable('permissions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, },
      name: { type: DataTypes.STRING(100), allowNull: false, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (qInterface: QueryInterface, transaction: Transaction, sequelize: Sequelize) => {
    await qInterface.dropTable(
      'permissions',
      { transaction },
    );
  };
};