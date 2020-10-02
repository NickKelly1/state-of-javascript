import { $DANGER } from "../types/$danger.type"
import { $FIXME } from "../types/$fix-me.type";
import { UnaryFn } from "../types/unary-fn.type";


export function pipe<T1, T2>(fn1: UnaryFn<T1, T2>): UnaryFn<T1, T2>;
export function pipe<T1, T2, T3>(fn1: UnaryFn<T1, T2>, fn2: UnaryFn<T2, T3>): UnaryFn<T1, T3>;
export function pipe<T1, T2, T3, T4>(fn1: UnaryFn<T1, T2>, fn2: UnaryFn<T2, T3>, fn3: UnaryFn<T3, T4>): UnaryFn<T1, T4>;
export function pipe<T1, T2, T3, T4, T5>(fn1: UnaryFn<T1, T2>, fn2: UnaryFn<T2, T3>, fn3: UnaryFn<T3, T4>, fn4: UnaryFn<T4, T5>): UnaryFn<T1, T5>;
export function pipe(...args: unknown[]): unknown {
  return function (init: unknown): unknown {
    // TODO: type this...
    return args.reduce((prev, fn) => (fn as $FIXME<Function>)(prev), init);
  }
} 