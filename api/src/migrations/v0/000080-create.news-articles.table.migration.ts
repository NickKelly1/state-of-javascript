import { DataTypes, } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.createTable('news_articles', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
      status_id: { type: DataTypes.INTEGER, references: { model: 'news_article_statuses', key: 'id' }, allowNull: false },
      author_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false, },
      scheduled_for: { type: DataTypes.DATE, allowNull: true, },
      title: { type: DataTypes.STRING(100), allowNull: false },
      teaser: { type: DataTypes.TEXT, allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.dropTable(
      'news_articles',
      { transaction },
    );
  };
}
