import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Debounce } from "../helpers/debounce.helper";
import { IAnyFn } from "../types/any-fn.type";
import { OrPromise } from "../types/or-promise.type";
import { useUpdate } from "./use-update.hook";



export interface IUseDebounceFireFnReturn {
  (fn: () => any): void;
}

export interface IUseDebounceAbortFnReturn {
  (): void;
}

export interface IUseDebounceReturn {
  isDebouncing: boolean;
  isRunning: boolean;
  isActive: boolean;
  fire: IUseDebounceFireFnReturn;
  abort: IUseDebounceAbortFnReturn;
}

export interface IUseDebounceArg {
  ms: number;
  abortOnUnmount: boolean;
}

export function useDebounce(arg: IUseDebounceArg): IUseDebounceReturn {
  const { ms, abortOnUnmount } = arg;
  const debounce = useMemo(() => new Debounce(ms), []);
  useUpdate(() => { debounce.setMs(ms); }, [ms]);

  const [isDebouncing, setIsDebouncing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const fire = useCallback<IUseDebounceFireFnReturn>((fn: () => any) => {
    setIsDebouncing(true);
    setIsActive(true);
    debounce.set(async () => {
      setIsRunning(true);
      setIsDebouncing(false);
      await fn();
      setIsRunning(false);
      setIsActive(false);
    });
  }, [debounce]);

  const abort = useCallback<IUseDebounceAbortFnReturn>(() => {
    debounce.abort();
  }, [debounce]);

  const result = useMemo<IUseDebounceReturn>(() => ({
    isActive,
    isDebouncing,
    isRunning,
    fire,
    abort,
  }), [
    isActive,
    isDebouncing,
    isRunning,
    fire,
    abort,
  ]);

  useEffect(() => { if (abortOnUnmount) { return () => debounce.abort() } }, [abortOnUnmount]);

  return result;
}