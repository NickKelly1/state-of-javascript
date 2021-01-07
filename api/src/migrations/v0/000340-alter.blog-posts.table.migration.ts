import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.addColumn(
      'blog_posts',
      'image_id',
      { type: DataTypes.INTEGER, references: { model: 'images', key: 'id', }, allowNull: true, },
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.removeColumn(
      'blog_posts',
      'image_id',
      { transaction },
    );
  };
}
