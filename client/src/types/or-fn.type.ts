import { ist } from "../helpers/ist.helper";

export type OrFn<T> = T | (() => T);
export function unwapOrFn<T>(fn: OrFn<T>): T { return ist.fn(fn) ? fn() : fn; }
