import { QueryInterface, Sequelize, DataTypes, Transaction } from "sequelize";
import { IMigration } from "../../common/migration/migration.interface";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (qInterface: QueryInterface, transaction: Transaction, sequelize: Sequelize) => {
    await qInterface.createTable('user_passwords', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, },
      user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false, },
      salt: { type: DataTypes.TEXT, allowNull: false, },
      hash: { type: DataTypes.TEXT, allowNull: false, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
  }

  down = async (qInterface: QueryInterface, transaction: Transaction, sequelize: Sequelize) => {
    await qInterface.dropTable(
      'user_passwords',
      { transaction },
    );
  };
};