import { AddUniqueConstraintOptions } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    const opts: AddUniqueConstraintOptions = { name: 'dashboard_id_npms_package_id', fields: ['dashboard_id', 'npms_package_id'], type: 'unique' };
    await queryInterface.addConstraint('npms_dashboard_items', { ...opts, transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.removeConstraint('npms_dashboard_items', 'dashboard_id_npms_package_id', { transaction });
  };
}
