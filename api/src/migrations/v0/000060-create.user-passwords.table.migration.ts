import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.createTable('user_passwords', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, },
      user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false, },
      salt: { type: DataTypes.TEXT, allowNull: false, },
      hash: { type: DataTypes.TEXT, allowNull: false, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.dropTable(
      'user_passwords',
      { transaction },
    );
  };
}
