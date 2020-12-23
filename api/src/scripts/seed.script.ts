import yargs from 'yargs';
import { Extractor } from '../common/helpers/extractor.helper';

const yargv = yargs(process.argv).argv;
const to = Extractor({ fromObj: yargv, fromName: 'Argument' });

// this is the expected script
to.oneOf(['seed'])('script');

// seedRun();
// TODO....
throw new Error('NOT IMPLEMENTED...');
