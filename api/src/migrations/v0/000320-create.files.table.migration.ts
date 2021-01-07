import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.createTable('files', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
      uploader_aid: { type: DataTypes.STRING(255), allowNull: false, },
      uploader_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false, },
      title: { type: DataTypes.STRING(255), allowNull: false, },
      is_public: { type: DataTypes.BOOLEAN, allowNull: false, },
      mimetype: { type: DataTypes.STRING(50), allowNull: true, },
      encoding: { type: DataTypes.STRING(50), allowNull: true, },
      filename: { type: DataTypes.TEXT, allowNull: false, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.dropTable(
      'files',
      { transaction },
    );
  };
}
