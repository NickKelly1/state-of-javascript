import { QueryInterface, Sequelize, DataTypes, Transaction } from "sequelize";
import { IMigration } from "../../common/interfaces/migration.interface";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (qInterface: QueryInterface, transaction: Transaction, sequelize: Sequelize) => {
    await qInterface.createTable('role_permissions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, },
      role_id: { type: DataTypes.INTEGER, references: { model: 'roles', key: 'id' }, allowNull: false, },
      permission_id: { type: DataTypes.INTEGER, references: { model: 'permissions', key: 'id' }, allowNull: false, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
  }

  down = async (qInterface: QueryInterface, transaction: Transaction, sequelize: Sequelize) => {
    await qInterface.dropTable(
      'role_permissions',
      { transaction },
    );
  };
};