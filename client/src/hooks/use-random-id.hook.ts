import { nanoid } from 'nanoid';
import { DependencyList, useMemo } from 'react';

export function useRandomId(deps: DependencyList): string {
  const result = useMemo(() => nanoid(), deps);
  return result;
}