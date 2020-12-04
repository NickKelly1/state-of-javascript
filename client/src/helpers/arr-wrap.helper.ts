export function arrWrap<T>(val: T | T[]): T[] {
  if (Array.isArray(val)) return val;
  return [val];
}
export function arrUnwrap<T>(val: T | T[]): T {
  if (Array.isArray(val)) return val[0];
  return val;
}