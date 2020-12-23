import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.createTable('blog_post_comments', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
      author_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false, },
      post_id: { type: DataTypes.INTEGER, references: { model: 'blog_posts', key: 'id' }, allowNull: false },
      hidden: { type: DataTypes.BOOLEAN, allowNull: false, },
      visible: { type: DataTypes.BOOLEAN, allowNull: false, },
      body: { type: DataTypes.TEXT, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.dropTable(
      'blog_post_comments',
      { transaction },
    );
  };
}
