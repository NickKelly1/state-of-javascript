
export interface INot { <A>(fn: (arg: A) => boolean ): (arg: A) => boolean }
export const not: INot = <A>(fn: (arg: A) => boolean) => (arg: A) => !fn(arg);
