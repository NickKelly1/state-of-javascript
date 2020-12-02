
export interface ITap {
  <A>(fn: (arg: A) => any): (arg: A) => A;
}
export const tap: ITap = <A>(fn: (arg: A) => any) => (arg: A) => { fn(arg); return arg; };