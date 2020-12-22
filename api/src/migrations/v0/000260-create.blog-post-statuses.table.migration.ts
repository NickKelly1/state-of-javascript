import { DataTypes, Op } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

function getData() {
  const now = new Date();
  const statuses = [
    { id: 10, name: 'draft', colour: '#F7DCB7', created_at: now, updated_at: now },
    { id: 20, name: 'rejected', colour: '#F7AFD6', created_at: now, updated_at: now },
    { id: 30, name: 'submitted', colour: '#BBEDDE', created_at: now, updated_at: now },
    { id: 40, name: 'unpublished', colour: '#BFBFD6', created_at: now, updated_at: now },
    { id: 50, name: 'published', colour: '#B8D9C5', created_at: now, updated_at: now },
  ];
  return { statuses };
}

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    const { statuses } = getData();
    await queryInterface.createTable('blog_post_statuses', {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      colour: { type: DataTypes.STRING(30), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
    await queryInterface.bulkInsert(
      'blog_post_statuses',
      statuses,
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    const { statuses } = getData();
    await queryInterface.bulkDelete(
      'blog_post_statuses',
      { id: { [Op.in]: statuses.map(stat => stat.id) }, },
      { transaction },
    );
    await queryInterface.dropTable(
      'npms_dashboard_statuses',
      { transaction },
    );
  };
}
