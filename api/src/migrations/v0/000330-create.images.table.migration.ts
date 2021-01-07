import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.createTable('images', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
      fsid: { type: DataTypes.STRING(255), allowNull: false, unique: true, },
      title: { type: DataTypes.STRING(255), allowNull: false, },
      thumbnail_id: { type: DataTypes.INTEGER, references: { model: 'files', key: 'id' }, unique: true, allowNull: true, },
      display_id: { type: DataTypes.INTEGER, references: { model: 'files', key: 'id' }, unique: true, allowNull: true, },
      original_id: { type: DataTypes.INTEGER, references: { model: 'files', key: 'id' }, unique: true, allowNull: true, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.dropTable(
      'images',
      { transaction },
    );
  };
}
