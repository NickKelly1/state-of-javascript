/**
 * Lazily apply a unary function
 */
export const later = <U, T>(wrap: (arg: U) => T) => (arg: U): T => wrap(arg);