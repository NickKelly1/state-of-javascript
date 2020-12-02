import { QueryInterface, Sequelize, DataTypes, Transaction } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.createTable('npms_packages', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
      name: { type: DataTypes.STRING(255), unique: true, allowNull: false, },
      last_ran_at: { type: DataTypes.DATE, allowNull: false, },
      data: { type: DataTypes.JSONB, allowNull: true, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.dropTable(
      'npms_packages',
      { transaction },
    );
  };
};