
export function lazy<T>(fn: () => T): () => T {
  let cached: undefined | T;
  return function cache() {
    if (cached) return cached;
    cached = fn();
    return cached;
  }
}