import { RandomFn } from "../types/random-fn.type";
import { randomIndex } from "./random-index.helper";



// Math.random(1)
// need seedable rng...

// https://www.npmjs.com/package/seed-random

export function shuffle<T>(
  initial: T[],
  options?:  {
    random?: RandomFn;
  },
): T[] {
  const remainingIndexes = Array(initial.length).fill(0).map((_, i) => i);
  const final: T[] = [];
  while (remainingIndexes.length) {
    const [takeIndex] = remainingIndexes.splice(randomIndex(remainingIndexes, options), 1);
    const takeValue = initial[takeIndex];
    final.push(takeValue);
  }
  return final;
}