import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.createTable('permissions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, },
      name: { type: DataTypes.STRING(100), allowNull: false, },
      category_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'permission_categories', key: 'id' } },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.dropTable(
      'permissions',
      { transaction },
    );
  }
}
