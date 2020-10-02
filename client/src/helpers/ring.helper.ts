
/**
 * Treat the arrays indexes as a ring
 */
export function ring<T>(arr: T[], index: number): T {
  return arr[index % arr.length]
}