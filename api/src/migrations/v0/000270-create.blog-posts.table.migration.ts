import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.createTable('user_tokens', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, },
      type_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user_token_types', key: 'id', }, },
      slug: { type: DataTypes.TEXT, unique: true, allowNull: false, },
      redirect_uri: { type: DataTypes.TEXT, allowNull: true, },
      data: { type: DataTypes.JSONB, allowNull: true, },
      expires_at: { type: DataTypes.DATE, allowNull: true, },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    await queryInterface.dropTable(
      'user_tokens',
      { transaction },
    );
  };
}
