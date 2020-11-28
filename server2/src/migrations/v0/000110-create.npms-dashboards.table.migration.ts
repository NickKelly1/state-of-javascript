import { QueryInterface, Sequelize, DataTypes, Transaction } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.createTable('npms_dashboards', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
      name: { type: DataTypes.STRING(100), unique: true, allowNull: false, },
      owner_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: true, },
      shadow_id: { type: DataTypes.STRING(255), allowNull: true, },
      status_id: { type: DataTypes.INTEGER, references: { model: 'npms_dashboard_statuses', key: 'id' }, allowNull: false, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.dropTable(
      'npms_dashboards',
      { transaction },
    );
  };
};