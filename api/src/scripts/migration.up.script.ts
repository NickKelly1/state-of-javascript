import yargs from 'yargs';
import { createSequelize } from '../app/db/create-sequelize';
import { EnvServiceSingleton } from '../common/environment/env';
import { Extractor } from '../common/helpers/extractor.helper';
import { prettyQ } from '../common/helpers/pretty.helper';
import { logger } from '../common/logger/logger';
import { MigrationRunner } from '../common/migration/migration.runner';
import { migrateDown } from '../common/migration/migrate.down';
import { migrateUp } from '../common/migration/migrate.up';
import { ScriptGuard } from '../script-guard';

const yargv = yargs(process.argv).argv;
const to = Extractor({ fromObj: yargv, fromName: 'Argument' });

// can execute scripts
ScriptGuard.check();

// this is the expected script
to.oneOf(['migration_up'])('script');

migrateUp({ step: to.optional(() => to.number('step')) });
