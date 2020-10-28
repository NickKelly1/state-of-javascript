import yargs from 'yargs';
import { createSequelize } from '../app/db/create-sequelize';
import { EnvServiceSingleton } from '../common/environment/env';
import { Extractor } from '../common/helpers/extractor.helper';
import { prettyQ } from '../common/helpers/pretty.helper';
import { logger } from '../common/logger/logger';
import { MigrationRunner } from '../common/migration/migration.runner';
import { migrateScriptDown } from '../common/migration/migration.script.down';
import { migrateScriptUp } from '../common/migration/migration.script.up';

const yargv = yargs(process.argv).argv;
const to = Extractor({ fromObj: yargv, fromName: 'Argument' });
migrateScriptUp({ step: to.optional(() => to.number('step')) });
