import { DependencyList, useEffect, useRef } from "react";


/**
 * Runs after first mount...
 * Therefore also runs after server-side render...
 */
export function useUpdate(fn: () => any, deps: DependencyList): void {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { return void (isFirst.current = false); }
    fn();
  }, deps);
}