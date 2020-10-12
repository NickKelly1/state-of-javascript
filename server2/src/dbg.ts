import { debug, Debug } from 'debug';
import { DebugOpt } from './constants/debug-opt.const';

export const Dbg = {
  Www: debug(DebugOpt.www),
  App: debug(DebugOpt.app),
} as const;