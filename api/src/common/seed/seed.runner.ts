import { QueryInterface, Sequelize, Transaction } from "sequelize";
import { EnvService } from "../environment/env";
import { logger } from "../logger/logger";
import fs from 'fs/promises';
import path from 'path';
import { ist } from "../helpers/ist.helper";
import { prettyQ } from "../helpers/pretty.helper";
import { IFsSeederDescriptor } from './fs-seeder-descriptor.interface';
import { Str } from '../helpers/str.helper';
import { BaseContext } from "../context/base.context";


export class SeedRunner {
  protected readonly ctx: BaseContext;
  protected readonly sequelize: Sequelize;
  protected readonly transaction: Transaction;
  protected readonly queryInterface :QueryInterface;
  protected readonly env: EnvService;


  constructor(arg: {
    ctx: BaseContext,
    sequelize: Sequelize;
    transaction: Transaction;
    queryInterface :QueryInterface;
    env: EnvService;
  }) {
    this.ctx = arg.ctx;
    this.sequelize = arg.sequelize;
    this.transaction = arg.transaction;
    this.queryInterface = arg.queryInterface;
    this.env = arg.env;
  }


  /**
   * Scan the filesystem for all seeders
   *
   * @param currentDirectory
   */
  protected async _scanFsSeeders(currentDirectory: string): Promise<IFsSeederDescriptor[]> {
    logger.debug(`scanning for seeders in "${currentDirectory}" ending with ${this.env.EXT}...`);
    // const topLevelFiles = await fs.readdir(currentDirectory, { withFileTypes: true });
    const topLevelFiles = await fs
      .readdir(currentDirectory, { withFileTypes: true })
      .then(tlfs => (tlfs.filter(tlf => (!tlf.isFile() ||  tlf.name.endsWith(this.env.EXT)))));
    const nestedDescriptors = await Promise.all(topLevelFiles.map(async (file): Promise<IFsSeederDescriptor[]> => {
      const filePath = path.join(currentDirectory, file.name);

      // file -> get migration descriptor
      if (file.isFile()) {
        const match = file.name.match(/^\d+/);
        if (!match?.[0]) { throw new TypeError(`File name "${file.name}" does not start with a number`) }
        const number = parseInt(match.toString(), 10);
        if (!Number.isFinite(number)) throw new Error(`Unexpected seeder number "${match.toString()}" for file "${filePath}"`);
        logger.debug(`importing "${filePath}"`)
        const imp = await import(filePath);
        let seeder: IFsSeederDescriptor;
        // assume import is ctor
        if (imp instanceof Function) {
          seeder = {
            number,
            file: Str.dontStartWith({ haystack: filePath, needle: this.env.ROOT_DIR }),
            name: file.name,
            Ctor: imp,
          };
        }
        // import might have a .default with the default export
        else if (ist.obj(imp)) {
          if (ist.keyof(imp, 'default')) {
            seeder = {
              number,
              file: Str.dontStartWith({ haystack: filePath, needle: this.env.ROOT_DIR }),
              name: file.name,
              Ctor: imp.default
            };
          }
          else { throw new Error(`Unexpected seeder file import ${prettyQ(imp)}`); }
        }
        // import is not a function or object
        else { throw new Error(`Unexpected seeder file import ${prettyQ(imp)}`) }
        logger.debug(`parsed seeder "${number}" - "${file.name}"`);
        const result: IFsSeederDescriptor[] = [seeder];
        return result;
      }

      // directory -> go deeper
      else if (file.isDirectory()) {
        const result = await this._scanFsSeeders(filePath);
        return result;
      }

      // not directory or file -> throw
      else { throw new Error(`Unexpected seeder file type "${filePath}"`); }
    }));

    // sort numerically on "MigrationDescriptor.number"
    return nestedDescriptors.flat().sort((a, b) => a.number - b.number);
  }


  /**
   * Sort filesystem migrations
   * 
   * @param dir
   * @param arr
   */
  protected _sortFsSeeders(dir: 'asc' | 'desc', arr: IFsSeederDescriptor[]): void {
    switch (dir) {
      case 'asc': return void arr.sort((a, b) => (+a.number) + (-b.number));
      case 'desc': return void arr.sort((a, b) => (-a.number) + (+b.number));
      default: throw new Error(`unhandled sort direction "${dir}"`);
    }
  }


  /**
   * Run seeders
   *
   * @param arg
   */
  async run() {
    const seeders = await this._scanFsSeeders(this.env.SEEDERS_DIR);
    this._sortFsSeeders('asc', seeders);

    const runCount = seeders.length;
    for (let i = 0; i < runCount; i += 1) {
      const descriptor = seeders[i];
      logger.info(`seeding (${(i + 1).toString().padStart(2, ' ')} / ${runCount.toString().padStart(2, ' ')}): ${descriptor.number} - ${descriptor.name}`);
      await new descriptor.Ctor().run({
        ctx: this.ctx,
        env: this.env,
        queryInterface: this.queryInterface,
        sequelize: this.sequelize,
        transaction: this.transaction,
      });
    }
  }
}
