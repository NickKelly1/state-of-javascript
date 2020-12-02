import { QueryInterface, Sequelize, DataTypes, Transaction, AddUniqueConstraintOptions } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const opts: AddUniqueConstraintOptions = { name: 'dashboard_id_npms_package_id', fields: ['dashboard_id', 'npms_package_id'], type: 'unique' };
    await queryInterface.addConstraint('npms_dashboard_items', { ...opts, transaction });
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.removeConstraint('npms_dashboard_items', 'dashboard_id_npms_package_id', { transaction });
  };
};