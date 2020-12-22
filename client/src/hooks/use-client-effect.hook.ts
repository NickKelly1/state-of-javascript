import { DependencyList, EffectCallback, } from "react";
import { useMounted } from "./use-mounted.hook";
import { useUpdate } from "./use-update.hook";

export function useClientEffect(cb: EffectCallback, deps: DependencyList): void {
  const isMounted = useMounted();
  useUpdate(cb, [isMounted, ...deps]);
}