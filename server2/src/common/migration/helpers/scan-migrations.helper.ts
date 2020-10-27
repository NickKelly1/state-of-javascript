import path from 'path';
import fs from 'fs/promises';
import { IMigrationDescriptor } from '../interfaces/migration-descriptor.interface';
import { logger } from '../../logger/logger';
import { ist } from '../../helpers/ist.helper';
import { prettyQ } from '../../helpers/pretty.helper';

export async function deepScanMigrationDescriptors(currentDirectory: string): Promise<IMigrationDescriptor[]> {
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
      // import might have a .default with the default import
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
      const result = await deepScanMigrationDescriptors(filePath);
      return result;
    }

    // not directory or file -> throw
    else { throw new Error(`Unexpected migration file type "${filePath}"`); }
  }));

  // sort numerically on "MigrationDescriptor.number"
  return nestedDescriptors.flat().sort((a, b) => a.number - b.number);
}