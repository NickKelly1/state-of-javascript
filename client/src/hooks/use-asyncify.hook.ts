import { DependencyList, useCallback, useMemo, useRef, useState } from "react";
import { unwrapAttempt } from "../helpers/attempted.helper";
import { ist } from "../helpers/ist.helper";
import { IAsyncState, IAsyncStateAll, IAsyncStateErrored, IAsyncStateLoading, IAsyncStateSuccess, IAsyncStateUninitialised } from "../types/async.types";
import { OrFn, unwapOrFn } from "../types/or-fn.type";
import { OrPromise } from "../types/or-promise.type";
import { OrUndefined } from "../types/or-undefined.type";

export interface IUseAsyncifyFireFnArg<A, R> { (arg: A): OrPromise<R>; }
export interface IUseAsyncifyFireFnReturn<A> { (arg: A): Promise<void>; }
export type IUseAsyncifyReturn<A, R, E> = [fire: IUseAsyncifyFireFnReturn<A>, state: IAsyncStateAll<R, E>];
const defaultInitialState: IAsyncStateUninitialised = { isLoading: false, error: null, value: null };

/**
 * Map to Loading
 *
 * @param prev
 */
function toAsyncLoading<R, E>(prev?: IAsyncStateAll<R, E>): IAsyncStateLoading<R> {
  const nState: IAsyncStateLoading<R> = {
    isLoading: true,
    error: null,
    value: prev?.value ?? null,
  };
  return nState;
}

/**
 * Map to Error
 *
 * @param error
 */
function toAsyncError<E>(error: E) {
  return function toError2<R>(prev?: IAsyncStateAll<R, E>): IAsyncStateErrored<R, E> {
    const nState: IAsyncStateErrored<R, E> = {
      isLoading: false,
      error: error as E,
      value: prev?.value ?? null,
    };
    return nState;
  }
}

/**
 * Map to Success
 *
 * @param error
 */
function toAsyncSuccess<R>(success: R) {
  return function toSuccess2<E>(prev?: IAsyncStateAll<R, E>): IAsyncStateSuccess<R> {
    const nState: IAsyncStateSuccess<R> = {
      isLoading: false,
      error: null,
      value: success,
    };
    return nState;
  }
}

/**
 * Hook for a generic asynchronous function
 * 
 * Function can also be manually re-fired
 *
 * Gives isLoading, error, data
 * 
 * Function must take no arguments
 * 
 * Does NOT run on deps change. Can only be fired manually
 *
 * @param fn
 * @param deps
 * @param initial
 */
export function useAsyncify<A, R, E = unknown>(arg: {
  fn: IUseAsyncifyFireFnArg<A, R>,
  deps: DependencyList,
  initial?: OrFn<OrUndefined<R>>,
}): IUseAsyncifyReturn<A, R, E> {
  const { fn, deps, initial } = arg;
  const [state, setState] = useState<IAsyncStateAll<R, E>>(() => {
    if (ist.undefined(initial)) return defaultInitialState;
    const initialState2 = unwapOrFn(initial);
    if (ist.undefined(initialState2)) return defaultInitialState;
    return toAsyncSuccess(initialState2)();
  });
  const callRef = useRef(0);
  const fire: IUseAsyncifyFireFnReturn<A> = useCallback(async (args: A) => {
    // if fire is called while still executing, forget the stale execution context...
    const call = (callRef.current += 1);
    const isCurrent = () => (call === callRef.current);
    // set loading
    setState(toAsyncLoading);
    try {
      const result = await fn(args);
      // set success
      if (isCurrent()) { setState(toAsyncSuccess(result)); }
    } catch (error) {
      // set errored
      if (isCurrent()) { setState(toAsyncError(error as E)); }
    }
  }, deps);

  return [fire, state];
}
