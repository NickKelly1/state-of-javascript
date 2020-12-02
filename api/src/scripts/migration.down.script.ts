import yargs from "yargs";
import { Extractor } from "../common/helpers/extractor.helper";
import { migrateDown } from "../common/migration/migrate.down";
import { ScriptGuard } from "../script-guard";

const yargv = yargs(process.argv).argv;
const to = Extractor({ fromObj: yargv, fromName: 'Argument' });

// can execute scripts
ScriptGuard.check();

// this is the expected script
to.oneOf(['migration_down'])('script');

migrateDown({
  step: to.optional(() => to.number('step')),
  by: to.optional(() => to.oneOf(['batch', 'number'])('by')),
});