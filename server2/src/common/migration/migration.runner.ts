import iterare from 'iterare';
import { DataTypes, Model, QueryInterface, Sequelize, Transaction } from "sequelize";
import { EnvService } from "../environment/env";
import { logger } from "../logger/logger";
import fs from 'fs/promises';
import path from 'path';
import { ist } from "../helpers/ist.helper";
import { prettyQ } from "../helpers/pretty.helper";
import { created_at } from "../schemas/constants/created_at.const";
import { updated_at } from "../schemas/constants/updated_at.const";
import { Arr } from "../helpers/arr.helper";
import { assertDefined } from "../helpers/assert-defined.helper";
import { _migrations } from './_migration.const';
import { IMigrationAttributes } from './migraiton.attributes';
import { IFsMigrationDescriptor } from './fs-migration-descriptor.interface';
import { initMigrationModel, MigrationModel } from './migration.model';
import { Str } from '../helpers/str.helper';



export class MigrationRunner {
  protected readonly sequelize: Sequelize;
  protected readonly transaction: Transaction;
  protected readonly queryInterface :QueryInterface;
  protected readonly env: EnvService;


  constructor(arg: {
    sequelize: Sequelize;
    transaction: Transaction;
    queryInterface :QueryInterface;
    env: EnvService;
  }) {
    this.sequelize = arg.sequelize;
    this.transaction = arg.transaction;
    this.queryInterface = arg.queryInterface;
    this.env = arg.env;
  }


  /**
   * Ensure the migration table exists
   *
   * @param arg
   */
  protected async _ensureMigrationTable(): Promise<void> {
    // initialise in database
    const allTables = await this.queryInterface.showAllTables({ transaction: this.transaction });
    const migrationsTable = allTables.find(table => table === _migrations);
    if (ist.nullable(migrationsTable)) {
      logger.info(`creating "${_migrations}" table...`);
      await this.queryInterface.createTable<Model<IMigrationAttributes>>(
        { tableName: _migrations, },
        {
          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
          name: { type: DataTypes.STRING(600), allowNull: false },
          number: { type: DataTypes.INTEGER, unique: true, allowNull: false },
          batch: { type: DataTypes.INTEGER, allowNull: false },
          ran_at: { type: DataTypes.DATE, allowNull: false },
        },
        { transaction: this.transaction, },
      );
      logger.info(`finished creating "${_migrations}" table...`);
    }
    initMigrationModel({ env: this.env, sequelize: this.sequelize });
  }


  /**
   * Scan the filesystem for all migrations
   *
   * @param currentDirectory
   */
  protected async _scanFsMigrations(currentDirectory: string): Promise<IFsMigrationDescriptor[]> {
    logger.debug(`scanning for migrations in "${currentDirectory}" ending with ${this.env.EXT}...`);
    const topLevelFiles = await fs
      .readdir(currentDirectory, { withFileTypes: true })
      .then(tlfs => (tlfs.filter(tlf => (!tlf.isFile() ||  tlf.name.endsWith(this.env.EXT)))));
    const nestedDescriptors = await Promise.all(topLevelFiles.map(async (file): Promise<IFsMigrationDescriptor[]> => {
      const filePath = path.join(currentDirectory, file.name);

      // file -> get migration descriptor
      if (file.isFile()) {
        const match = file.name.match(/^\d+/);
        if (!match?.[0]) { throw new TypeError(`File name "${file.name}" does not start with a number`) }
        const number = parseInt(match.toString(), 10);
        if (!Number.isFinite(number)) throw new Error(`Unexpected migration number "${match.toString()}" for file "${filePath}"`);
        logger.debug(`importing "${filePath}"`)
        const imp = await import(filePath);
        let mig: IFsMigrationDescriptor;
        // assume import is ctor
        if (imp instanceof Function) {
          mig = {
            number,
            file: Str.dontStartWith({ haystack: filePath, needle: this.env.ROOT_DIR }),
            name: file.name,
            Ctor: imp,
          };
        }
        // import might have a .default with the default export
        else if (ist.obj(imp)) {
          if (ist.keyof(imp, 'default')) {
            mig = {
              number,
              file: Str.dontStartWith({ haystack: filePath, needle: this.env.ROOT_DIR }),
              name: file.name,
              Ctor: imp.default
            };
          }
          else { throw new Error(`Unexpected migration file import ${prettyQ(imp)}`); }
        }
        // import is not a function or object
        else { throw new Error(`Unexpected migration file import ${prettyQ(imp)}`) }
        logger.debug(`parsed migration "${number}" - "${file.name}"`);
        const result: IFsMigrationDescriptor[] = [mig];
        return result;
      }

      // directory -> go deeper
      else if (file.isDirectory()) {
        const result = await this._scanFsMigrations(filePath);
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
  protected async _findPendingMigrations(): Promise<{ nextBatch: number; pending: IFsMigrationDescriptor[] }> {
    // find previous migraitons
    const { dbMigrations, fsMigrations } = await this._findAndVerifyAllMigrations();
    const lastMigrationNumber = Arr.max('number')(dbMigrations);
    const nextBatch = (Arr.max('batch')(dbMigrations) ?? 0) + 1;
    const pending = ist.nullable(lastMigrationNumber)
      ? fsMigrations
      : fsMigrations.filter(found => found.number > lastMigrationNumber);
    return { pending, nextBatch, }
  }


  /**
   * Sort database migrations
   * 
   * @param dir
   * @param arr
   */
  protected _sortDbMigrationByNumber(dir: 'asc' | 'desc', arr: MigrationModel[]): void {
    switch (dir) {
      case 'asc': return void arr.sort((a, b) => (+a.number) + (-b.number));
      case 'desc': return void arr.sort((a, b) => (-a.number) + (+b.number));
      default: throw new Error(`unhandled sort direction "${dir}"`);
    }
  }


  /**
   * Sort filesystem migrations
   * 
   * @param dir
   * @param arr
   */
  protected _sortFsMigrationByNumber(dir: 'asc' | 'desc', arr: IFsMigrationDescriptor[]): void {
    switch (dir) {
      case 'asc': return void arr.sort((a, b) => (+a.number) + (-b.number));
      case 'desc': return void arr.sort((a, b) => (-a.number) + (+b.number));
      default: throw new Error(`unhandled sort direction "${dir}"`);
    }
  }


  /**
   * Find all pending migrations
   */
  protected async _findAndVerifyAllMigrations(): Promise<{
    fsMigrations: IFsMigrationDescriptor[];
    fsMigrationsMap: Map<number, IFsMigrationDescriptor>;
    dbMigrations: MigrationModel[];
    dbMigrationsMap: Map<number, MigrationModel>;
  }> {
    // find previous migraitons
    const [
      dbMigrations,
      fsMigrations,
    ] = await Promise.all([
      MigrationModel.findAll({ transaction: this.transaction, }),
      this._scanFsMigrations(this.env.MIGRATIONS_DIR),
    ]);

    const dbMigrationsMap = new Map(dbMigrations.map(dbm => [dbm.number, dbm]));
    const fsMigrationsMap = new Map(fsMigrations.map(fsm => [fsm.number, fsm]));

    // check for duplicate migration numbers from filesystem
    if (fsMigrationsMap.size !== fsMigrations.length) {
      const check = Object.fromEntries(fsMigrations.map(fsm => [fsm.number, 0]));
      fsMigrations.forEach(fsm => check[fsm.number] += 1);
      const duplicates = Object.entries(check).filter(([number, count]) => count > 1).map(([number]) => assertDefined(fsMigrationsMap.get(Number(number))));
      throw new Error(`Found duplicate filesystem migration numbers: "${Object.values(duplicates).map(dup => dup.file).join('", "')}". Please correct this before continuing...`);
    }

    // check for fs migration numbers added that preceed the last run db migration number
    const maxDbNum = Arr.max('number')(dbMigrations);
    const fsShouldHaveBeenRun = ist.nullable(maxDbNum)
      ? []
      : fsMigrations.filter(fsm => (
        // should have already been run
        fsm.number < maxDbNum
        // hasn't already been run
        && !dbMigrationsMap.has(fsm.number)
      ));
    if (fsShouldHaveBeenRun.length) {
      throw new Error(`Found filesystem migrations that should have been run already but haven't: "${fsShouldHaveBeenRun.map(fsm => fsm.file).join("', '")}". Please corrent this before continuing...`);
    }

    // check that every db migration also exists in fs
    const missing = dbMigrations.filter(dbm => !fsMigrationsMap.has(dbm.number));
    if (missing.length) {
      throw new Error(`Found migrations missing from filesystem: "${missing.map(m => m.name).join('", "')}". Please correct this before continuing.`);
    }

    return {
      dbMigrations,
      dbMigrationsMap,
      fsMigrations,
      fsMigrationsMap,
    };
  }


  /**
   * Run the next "step" pending migrations
   *
   * @param arg
   */
  async up(arg?: {
    step?: number;
  }) {
    const { step } = arg ?? {};
    await this._ensureMigrationTable();
    const { nextBatch, pending } = await this._findPendingMigrations();

    const runCount = Math.max(0, Math.min(pending.length, step ?? pending.length));
    for (let i = 0; i < runCount; i += 1) {
      const descriptor = pending[i];
      const migrationRecord = MigrationModel.build({
        batch: nextBatch,
        number: descriptor.number,
        name: Str.dontEndWith({ needle: this.env.EXT, haystack: Str.beforeLastDot(descriptor.name) }),
        ran_at: new Date(),
      });
      logger.info(`migrating up (${(i + 1).toString().padStart(2, ' ')} / ${runCount.toString().padStart(2, ' ')}): ${descriptor.number} - ${descriptor.name}`);
      await migrationRecord.save({ transaction: this.transaction });
      await new descriptor.Ctor().up({
        env: this.env,
        queryInterface: this.queryInterface,
        sequelize: this.sequelize,
        transaction: this.transaction,
      });
    }
  }


  /**
   * Rollback the last "step" migration batches
   *
   * @param arg
   */
  async down(arg?: {
    step?: number;
    by?: 'batch' | 'number';
  }) {
    const { step, by: _by } = arg ?? {};
    const by: 'batch' | 'number' = _by || 'batch';
    await this._ensureMigrationTable();
    const { dbMigrations, fsMigrations, dbMigrationsMap, fsMigrationsMap } = await this._findAndVerifyAllMigrations();

    // down the last n batch
    this._sortFsMigrationByNumber('desc', fsMigrations);
    this._sortDbMigrationByNumber('desc', dbMigrations);


    switch (by) {
      case 'batch': {
        // descending
        const batches = Array
          .from(new Set(dbMigrations.map(dbm => dbm.batch)))
          .sort((a, b) => (-a) + (+b));
        const downCount = Math.max(0, Math.min(batches.length, step ?? batches.length));
        for (let i = 1; i <= downCount; i += 1) {
          const targetBatch = batches[i - 1];
          const inBatch = dbMigrations.filter(dbm => dbm.batch === targetBatch);
          this._sortDbMigrationByNumber('desc', inBatch);
          for (let j = 0; j < inBatch.length; j += 1) {
            const dbm = inBatch[j];
            logger.info(`migrating down [(${i.toString().padStart(2, ' ')}) / (${downCount.toString().padStart(2, ' ')})] - [(${(j + 1).toString().padStart(2, ' ')} / ${inBatch.length.toString().padStart(2, ' ')})]: ${dbm.number} - ${dbm.name}`);
            const fsm = assertDefined(fsMigrationsMap.get(dbm.number));
            await dbm.destroy({ transaction: this.transaction });
            await new fsm.Ctor().down({
              env: this.env,
              queryInterface: this.queryInterface,
              sequelize: this.sequelize,
              transaction: this.transaction,
            });
          }
        }
        break;
      }
      case 'number': {
        const downCount = Math.max(0, Math.min(dbMigrations.length, step ?? dbMigrations.length));
        for (let i = 0; i < downCount; i += 1) {
          const dbm = dbMigrations[i];
          logger.info(`migrating down (${i.toString().padStart(2, ' ')}) / (${downCount.toString().padStart(2, ' ')}): ${dbm.number} - ${dbm.name}`);
          const fsm = assertDefined(fsMigrationsMap.get(dbm.number));
          await dbm.destroy({ transaction: this.transaction });
          await new fsm.Ctor().down({
            env: this.env,
            queryInterface: this.queryInterface,
            sequelize: this.sequelize,
            transaction: this.transaction,
          });
        }
        break;
      }
      default: throw new Error(`unhandled by: "${by}"`);
    }
  }
}
