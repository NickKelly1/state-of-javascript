import { AddUniqueConstraintOptions } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    const opts: AddUniqueConstraintOptions = { name: 'role_id_permission_id', fields: ['role_id', 'permission_id'], type: 'unique' };
    await queryInterface.addConstraint('role_permissions', { ...opts, transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.removeConstraint('role_permissions', 'role_id_permission_id', { transaction });
  };
}
