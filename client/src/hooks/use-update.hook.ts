import { DependencyList, useEffect, useRef } from "react";
import { IAnyFn } from "../types/any-fn.type";


export function useUpdate(fn: () => any, deps: DependencyList): void {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { return void (isFirst.current = false); }
    fn();
  }, deps);
}