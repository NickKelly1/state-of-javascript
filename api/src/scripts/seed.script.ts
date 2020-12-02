import yargs from 'yargs';
import { Extractor } from '../common/helpers/extractor.helper';
import { seedRun } from '../common/seed/seed.run';
import { ScriptGuard } from '../script-guard';

const yargv = yargs(process.argv).argv;
const to = Extractor({ fromObj: yargv, fromName: 'Argument' });

// can execute scripts
ScriptGuard.check();

// this is the expected script
to.oneOf(['seed'])('script');

seedRun();
