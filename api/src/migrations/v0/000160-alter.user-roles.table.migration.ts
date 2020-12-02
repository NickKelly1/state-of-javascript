import { QueryInterface, Sequelize, DataTypes, Transaction, AddUniqueConstraintOptions } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const opts: AddUniqueConstraintOptions = { name: 'user_id_role_id', fields: ['user_id', 'role_id'], type: 'unique' };
    await queryInterface.addConstraint('user_roles', { ...opts, transaction });
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.removeConstraint('user_roles', 'user_id_role_id', { transaction });
  };
};