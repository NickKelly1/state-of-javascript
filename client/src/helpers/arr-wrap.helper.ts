export function arrWrap<T>(val: T | T[]): T[] {
  if (Array.isArray(val)) return val;
  return [val];
}