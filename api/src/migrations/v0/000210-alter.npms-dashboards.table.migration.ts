import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    // remove uniqueness of "name" column
    await queryInterface.changeColumn(
      'npms_dashboards',
      'name',
      { type: DataTypes.STRING(100), allowNull: false, unique: false, },
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    // add uniqueness to "name" column
    await queryInterface.changeColumn(
      'npms_dashboards',
      'name',
      { type: DataTypes.STRING(100), allowNull: false, unique: true, },
      { transaction },
    );
  };
}
