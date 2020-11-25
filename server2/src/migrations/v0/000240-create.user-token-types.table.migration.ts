import { QueryInterface, Sequelize, DataTypes, Transaction, Op } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";

function getData() {
  const now = new Date();
  const types = [
    { id: 10, name: 'forgotten-password-reset', created_at: now, updated_at: now },
    { id: 20, name: 'verify-email', created_at: now, updated_at: now },
    { id: 30, name: 'accept-welcome', created_at: now, updated_at: now },
  ];
  return { types };
}

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const { types } = getData();
    await queryInterface.createTable('user_token_types', {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
    await queryInterface.bulkInsert(
      'user_token_types',
      types,
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const { types } = getData();
    await queryInterface.bulkDelete(
      'user_token_types',
      { id: { [Op.in]: types.map(type => type.id) }, },
      { transaction },
    );
    await queryInterface.dropTable(
      'user_token_types',
      { transaction },
    );
  };
};