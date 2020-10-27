import { DataTypes, Model, QueryInterface, Sequelize, Transaction } from "sequelize";
import { EnvService } from "../../environment/env";
import { logger } from "../../logger/logger";
import { IMigrationDescriptor } from "../interfaces/migration-descriptor.interface";
import { MigrationModel } from "../model/migraiton.model";
import fs from 'fs/promises';
import path from 'path';
import { ist } from "../../helpers/ist.helper";
import { prettyQ } from "../../helpers/pretty.helper";
import { _migrations } from "../constants/_migration.const";
import { IMigrationAttributes } from "../model/migraiton.attributes";
import { created_at } from "../../schemas/constants/created_at.const";
import { updated_at } from "../../schemas/constants/updated_at.const";



class MigrationRunner {
  protected readonly sequelize: Sequelize;
  protected readonly transaction: Transaction;
  protected readonly qInterface :QueryInterface;
  protected readonly env: EnvService;


  constructor(arg: {
    sequelize: Sequelize;
    transaction: Transaction;
    qInterface :QueryInterface;
    env: EnvService;
  }) {
    this.sequelize = arg.sequelize;
    this.transaction = arg.transaction;
    this.qInterface = arg.qInterface;
    this.env = arg.env;
  }


  /**
   * Ensure the migration table exists
   *
   * @param arg
   */
  async ensureMigrationTable(arg: {
    transaction: Transaction;
    qInterface :QueryInterface;
    sequelize: Sequelize;
  }): Promise<void> {
    const { transaction, qInterface, sequelize } = arg;

    // initialise in database
    const allTables = await qInterface.showAllTables({ transaction });
    const migrationsTable = allTables.find(table => table === _migrations);
    if (ist.nullable(migrationsTable)) {
      logger.info(`creating "${_migrations}" table...`);
      await qInterface.createTable<Model<IMigrationAttributes>>(
        { tableName: _migrations, },
        {
          id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER.UNSIGNED },
          path: { type: DataTypes.STRING(600), unique: true, allowNull: false },
          file: { type: DataTypes.STRING(300), unique: true, allowNull: false },
          number: { type: DataTypes.INTEGER, unique: true, allowNull: false },
          batch: { type: DataTypes.INTEGER, allowNull: false },
          [created_at]: { type: DataTypes.DATE, allowNull: false, },
          [updated_at]: { type: DataTypes.DATE, allowNull: false, },
        },
        { transaction, },
      );
    }
  }


  /**
   * Scan the filesystem for all migrations
   *
   * @param currentDirectory
   */
  protected async scanFsMigrations(currentDirectory: string): Promise<IMigrationDescriptor[]> {
    logger.debug(`scanning for migrations "${currentDirectory}"...`);
    const topLevelFiles = await fs.readdir(currentDirectory, { withFileTypes: true });
    const nestedDescriptors = await Promise.all(topLevelFiles.map(async (file): Promise<IMigrationDescriptor[]> => {
      const filePath = path.join(currentDirectory, file.name);

      // file -> get migration descriptor
      if (file.isFile()) {
        const match = file.name.match(/^\d+/);
        if (!match?.[0]) { throw new TypeError(`File name "${file.name}" does not start with a number`) }
        const number = parseInt(match.toString(), 10);
        if (!Number.isFinite(number)) throw new Error(`Unexpected migration number "${match[0][0]}" for file "${filePath}"`);
        const imp = await import(filePath);
        let mig: IMigrationDescriptor;
        // assume import is ctor
        if (imp instanceof Function) { mig = { number, file: filePath, name: file.name, Ctor: imp, } }
        // import might have a .default with the default export
        else if (ist.obj(imp)) {
          if (ist.keyof(imp, 'default')) { mig = { number, file: filePath, name: file.name, Ctor: imp.default }; }
          else { throw new Error(`Unexpected migration file import ${prettyQ(imp)}`); }
        }
        // import is not a function or object
        else { throw new Error(`Unexpected migration file import ${prettyQ(imp)}`) }
        logger.debug(`parsed migration "${number}" - "${file.name}"`);
        const result: IMigrationDescriptor[] = [mig];
        return result;
      }

      // directory -> go deeper
      else if (file.isDirectory()) {
        const result = await this.scanFsMigrations(filePath);
        return result;
      }

      // not directory or file -> throw
      else { throw new Error(`Unexpected migration file type "${filePath}"`); }
    }));

    // sort numerically on "MigrationDescriptor.number"
    return nestedDescriptors.flat().sort((a, b) => a.number - b.number);
  }


  /**
   * Find all pending migrations
   */
  protected async findPendingMigrations(): Promise<{ nextBatch: number; pending: IMigrationDescriptor[] }> {
    // find previous migraitons
    const [
      lastMigration,
      foundMigrations,
    ] = await Promise.all([
      MigrationModel.findOne({
          transaction: this.transaction,
          order: [[ 'number', 'DESC' ]],
          limit: 1,
      }),
      this.scanFsMigrations(this.env.MIGRATIONS_DIR),
    ]);

    const lastMigrationNumber = lastMigration?.number;
    const nextBatch = (lastMigration?.batch ?? 0) + 1;

    const pending = ist.nullable(lastMigrationNumber)
      ? foundMigrations
      : foundMigrations.filter(found => found.number > lastMigrationNumber);

    return {
      pending,
      nextBatch,
    }
  }


  /**
   * Run the next "count" pending migrations
   *
   * @param arg
   */
  async up(arg: {
    count?: number;
  }) {
    const { env, qInterface, sequelize, transaction } = this;

    const pending: IMigrationDescriptor[] = '_todo_' as any;

    for (let i = 0; i < pending.length; i += 1) {
      const descriptor = pending[i];
      const migration = new descriptor.Ctor();
      const migrationRecord = MigrationModel.build({
        batch
        number: descriptor.number,
        file: descriptor.name,
        path: descriptor.file,
      });
      logger.info(`migrating (${i.toString().padStart(3, ' ')} / ${pending.length.toString().padStart(3, ' ')}): ${descriptor.number} - ${descriptor.name}`);
      await migrationRecord.save({ transaction });
      await migration.up(qInterface, transaction, sequelize);
    }
  }


  async down(arg: {
    //
  }) {
    const { env, qInterface, sequelize, transaction } = this;
    //
  }
}