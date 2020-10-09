import npmSeed from 'seed-random';
import { RandomFn } from '../types/random-fn.type';

export function randomIndex<T>(
  countable: ArrayLike<T>,
  options?: {
    random?: RandomFn;
  },
): number {
  const random = options?.random?.() ?? Math.random();
  return Math.floor(random * countable.length);
}