import { debug, Debug } from 'debug';

// windows doesn't work with the Debug package properly
// TODO: use Debug package when windows isn't required for design any-more
export const Dbg = {
  Www: (...args: any[]) => console.log('[Www]', ...args),
  App: (...args: any[]) => console.log('[App]', ...args),
  Db: (...args: any[]) => console.log('[Db]', ...args),
  // Www: debug('www'),
  // App: debug('app'),
  // Db: debug('db'),
} as const;

