import { randomIndex } from "./random-index.helper";


export function randomElement<T>(countable: ArrayLike<T>): T {
  return countable[randomIndex(countable)];
}