import { QueryInterface, Sequelize, DataTypes, Transaction } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    // remove uniqueness of "name" column
    await queryInterface.changeColumn(
      'npms_dashboards',
      'name',
      { type: DataTypes.STRING(100), allowNull: false, unique: false, },
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    // add uniqueness to "name" column
    await queryInterface.changeColumn(
      'npms_dashboards',
      'name',
      { type: DataTypes.STRING(100), allowNull: false, unique: true, },
      { transaction },
    );
  };
};