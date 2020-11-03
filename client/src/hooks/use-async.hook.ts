import { DependencyList, useCallback, useMemo, useRef, useState } from "react";
import { OrPromise } from "../types/or-promise.type";
import { OrUndefined } from "../types/or-undefined.type";

export interface IUseAsyncFireFnArg<A, R> {
  (arg: A): OrPromise<R>;
}
export interface IUseAsyncFireFnReturn<A> {
  (arg: A): Promise<void>;
}
export interface IUseAsyncReturn<A, R, E> {
  fire: IUseAsyncFireFnReturn<A>;
  data: OrUndefined<R>;
  isLoading: boolean;
  error: OrUndefined<E>;
}
export function useAsync<A, R, E>(preFire: IUseAsyncFireFnArg<A, R>, deps: DependencyList): IUseAsyncReturn<A, R, E> {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<OrUndefined<E>>(undefined);
  const [data, setData] = useState<OrUndefined<R>>(undefined);
  const callRef = useRef(0);
  const fire: IUseAsyncFireFnReturn<A> = useCallback(async (args: A) => {
    // if fire is called while still executing, forget the stale execution context...
    const call = (callRef.current += 1);
    const isCurrent = () => (call === callRef.current);
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await preFire(args);
      if (isCurrent()) setData(result);
    } catch (error) {
      if (isCurrent()) setError(error as E);
    } finally {
      if (isCurrent()) setIsLoading(false);
    }
  }, deps);
  const result: IUseAsyncReturn<A, R, E> = useMemo(() => ({
    isLoading,
    error,
    data,
    fire,
  }), [
    isLoading,
    error,
    data,
    fire,
  ]);
  return result;
}