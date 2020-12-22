import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.createTable('integrations', {
      id: { type: DataTypes.INTEGER, primaryKey: true, },
      name: { type: DataTypes.STRING(100), allowNull: false, },
      iv: { type: DataTypes.TEXT, allowNull: false, },
      encrypted_init: { type: DataTypes.TEXT, },
      encrypted_state: { type: DataTypes.TEXT, },
      error: { type: DataTypes.TEXT, },
      is_connected: { type: DataTypes.BOOLEAN, allowNull: false, },
      public: { type: DataTypes.TEXT, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.dropTable(
      'integrations',
      { transaction },
    );
  };
}
