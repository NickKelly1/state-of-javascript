import { DependencyList, useCallback, useMemo, useRef, useState } from "react";
import { OrPromise } from "../types/or-promise.type";
import { OrUndefined } from "../types/or-undefined.type";

export interface ISequence { (): number; }
export interface ISequenceReturn { next: ISequence; }
export function useSequence(): ISequenceReturn {
  const seq_counter = useRef(0);
  const seq = useMemo((): ISequenceReturn => ({ next: () => (seq_counter.current += 1) }), []);
  return seq;
}
