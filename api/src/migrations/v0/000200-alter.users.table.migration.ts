import { AddUniqueConstraintOptions, DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;

    // create email col
    await queryInterface.addColumn(
      'users',
      'email',
      { type: DataTypes.STRING(255), allowNull: true, unique: true, },
      { transaction },
    );

    // unique constraint over email + name
    const opts: AddUniqueConstraintOptions = { name: 'email_name', fields: ['email', 'name'], type: 'unique' };
    await queryInterface.addConstraint( 'users', { ...opts, transaction },);

    // create verified col
    await queryInterface.addColumn(
      'users',
      'verified',
      { type: DataTypes.BOOLEAN, allowNull: true, },
      { transaction },
    );

    // initialise verified col
    await sequelize.query(`
      UPDATE "users"
      SET "verified" = FALSE
    `, { transaction });

    // mark verified required
    await queryInterface.changeColumn(
      'users',
      'verified',
      { type: DataTypes.BOOLEAN, allowNull: false, },
      { transaction },
    );

    // create deactivated col
    await queryInterface.addColumn(
      'users',
      'deactivated',
      { type: DataTypes.BOOLEAN, allowNull: true, },
      { transaction },
    );

    // initialise deactivated col
    await sequelize.query(`
      UPDATE "users"
      SET "deactivated" = FALSE
    `, { transaction });

    // mark deactivated required
    await queryInterface.changeColumn(
      'users',
      'deactivated',
      { type: DataTypes.BOOLEAN, allowNull: false, },
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;

    // remove constraint
    await queryInterface.removeConstraint('users', 'email_name', { transaction });
    // remove deactivated col
    await queryInterface.removeColumn('users', 'deactivated', { transaction });
    // remove verified col
    await queryInterface.removeColumn('users', 'verified', { transaction });
    // remove email col
    await queryInterface.removeColumn('users', 'email', { transaction });
  };
};