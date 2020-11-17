import { QueryInterface, Sequelize, DataTypes, Transaction, Op } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";

function getData() {
  const now = new Date();
  const statuses = [
    { id: 10, name: 'draft', created_at: now, updated_at: now },
    { id: 20, name: 'rejected', created_at: now, updated_at: now },
    { id: 30, name: 'submitted', created_at: now, updated_at: now },
    { id: 40, name: 'approved', created_at: now, updated_at: now },
    { id: 50, name: 'unpublished', created_at: now, updated_at: now },
    { id: 60, name: 'published', created_at: now, updated_at: now },
  ];
  return { statuses };
}

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const { statuses } = getData();
    await queryInterface.createTable('npms_dashboard_statuses', {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
    await queryInterface.bulkInsert(
      'npms_dashboard_statuses',
      statuses,
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const { statuses } = getData();
    await queryInterface.bulkDelete(
      'npms_dashboard_statuses',
      { id: { [Op.in]: statuses.map(stat => stat.id) }, },
      { transaction },
    );
    await queryInterface.dropTable(
      'npms_dashboard_statuses',
      { transaction },
    );
  };
};