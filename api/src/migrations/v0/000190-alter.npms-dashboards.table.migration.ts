import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, sequelize, transaction } = arg;

    // create nullable col
    await queryInterface.addColumn(
      'npms_dashboards',
      'order',
      { type: DataTypes.INTEGER, allowNull: true, },
      { transaction },
    );

    // initialise order of all records
    await sequelize.query(`
      UPDATE "npms_dashboards"
      SET "order" = ("npms_dashboards"."id" - 1)
    `, { transaction });

    // make column required
    await queryInterface.changeColumn(
      'npms_dashboards',
      'order',
      { type: DataTypes.INTEGER, allowNull: false, },
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.removeColumn('npms_dashboards', 'order', { transaction });
  };
}
