import { QueryInterface, Sequelize, DataTypes, Transaction, Op } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";

function getData() {
  const now = new Date();
  const statuses = [
    { id: 10, name: 'draft', colour: '#D4BE8E', created_at: now, updated_at: now },
    { id: 20, name: 'rejected', colour: '#F6A9A5', created_at: now, updated_at: now },
    { id: 30, name: 'submitted', colour: '#B2D4D4', created_at: now, updated_at: now },
    { id: 40, name: 'approved', colour: '#C5EBAA', created_at: now, updated_at: now },
    { id: 50, name: 'unpublished', colour: '#CDC0F6', created_at: now, updated_at: now },
    { id: 60, name: 'published', colour: '#B2D6C5', created_at: now, updated_at: now },
  ];
  return { statuses };
}

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const { statuses } = getData();
    await queryInterface.createTable('news_article_statuses', {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      colour: { type: DataTypes.STRING(30), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
    await queryInterface.bulkInsert(
      'news_article_statuses',
      statuses,
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const { statuses } = getData();
    await queryInterface.bulkDelete(
      'news_article_statuses',
      { id: { [Op.in]: statuses.map(stat => stat.id) }, },
      { transaction },
    );
    await queryInterface.dropTable(
      'news_article_statuses',
      { transaction },
    );
  };
};