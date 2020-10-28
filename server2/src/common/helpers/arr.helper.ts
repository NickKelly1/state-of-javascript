import { OrUndefined } from "../types/or-undefined.type";

export const Arr = {
  max: <K extends string>(key: K) => <T extends Record<K, any>>(arr: T[]): OrUndefined<T[K]> => {
    if (arr.length === 0) return undefined;
    const first = arr[0];
    if (arr.length === 1) return first[key];
    const rest = arr.slice(1, arr.length);
    const max: T[K] = rest.reduce(
      (current: T[K], prevElem: T): T[K] => {
        const prev = prevElem[key];
        if (prev > current) { return prev; }
        if (prev < current) { return current; }
        return current;
      },
      first[key],
    );
    return max;
  },

  min: <K extends string>(key: K) => <T extends Record<K, any>>(arr: T[]): OrUndefined<T[K]> => {
    if (arr.length === 0) return undefined;
    const first = arr[0];
    if (arr.length === 1) return first[key];
    const rest = arr.slice(1, arr.length);
    const min: T[K] = rest.reduce(
      (current: T[K], prevElem: T): T[K] => {
        const prev = prevElem[key];
        if (prev > current) { return current; }
        if (prev < current) { return prev; }
        return current;
      },
      first[key],
    );
    return min;
  },
}
