import yargs from "yargs";
import { Extractor } from "../common/helpers/extractor.helper";
import { migrateScriptDown } from "../common/migration/migration.script.down";

const yargv = yargs(process.argv).argv;
const to = Extractor({ fromObj: yargv, fromName: 'Argument' });

migrateScriptDown({
  step: to.optional(() => to.number('step')),
  by: to.optional(() => to.oneOf(['batch', 'number'])('by')),
});