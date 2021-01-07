import { DependencyList, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ist } from "../helpers/ist.helper";
import { IAsyncState, IAsyncStateErrored, IAsyncStateLoading, IAsyncStateSuccess } from "../types/async.types";
import { OrFn } from "../types/or-fn.type";
import { OrPromise } from "../types/or-promise.type";
import { OrUndefined } from "../types/or-undefined.type";
import { useAsyncify } from "./use-asyncify.hook";

/**
 * Hook for a generic asynchronous function
 * 
 * Function can also be manually re-fired
 *
 * Gives isLoading, error, data
 * 
 * Function must take no arguments
 * 
 * Auto-runs on deps change
 */
export interface IUseAsyncFireFnArg<R> { (): OrPromise<R>; }
export interface IUseAsyncFireFnReturn { (): Promise<void>; }
export type IUseAsyncReturn<R, E>  = [refire: IUseAsyncFireFnReturn, state: IAsyncState<R, E>];
export function useAsync<R, E = unknown>(arg: {
  fn: IUseAsyncFireFnArg<R>;
  deps: DependencyList;
  initial?: OrFn<OrUndefined<R>>;
}): IUseAsyncReturn<R, E> {
  const { fn, deps, initial } = arg;
  const fn2 = useMemo(() => fn, [deps]);
  const [ fire, _state ] = useAsyncify<undefined, R, E>({ fn: fn2, deps: [...deps, fn2], initial });
  const refire = useCallback(() => fire(undefined), [fire]);
  // map from useAsyncify return to our useAsync return...
  const state = useMemo(() => {
    if (_state.isLoading) {
      const mapped: IAsyncStateLoading<R> = { isLoading: _state.isLoading, error: null, value: _state.value };
      return mapped;
    }
    if (_state.error) {
      const mapped: IAsyncStateErrored<R, E> = { isLoading: _state.isLoading, error: _state.error, value: _state.value };
      return mapped;
    }
    if (_state.value) {
      const mapped: IAsyncStateSuccess<R> = { isLoading: _state.isLoading, error: null, value: _state.value };
      return mapped;
    }
    const mapped: IAsyncStateLoading<R> = { isLoading: true, error: null, value: null };
    return mapped;
  }, [_state]);
  const skip = useRef(ist.defined(_state.value));
  // skip the first run if given initial data...
  useEffect(() => {
    if (skip.current) { return void (skip.current = false); }
    refire();
  }, [refire]);
  return [ refire, state ];
}
