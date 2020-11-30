import { OrNull } from "../types/or-null.type";
import { OrNullable } from "../types/or-nullable.type";



export interface IFindScaleReturn { multiplier: number, unit: OrNull<string> }
export const num = {
  maxOf(numbers: OrNullable<OrNullable<number>[]>, otherwise: number = 0): number {
    const max = numbers?.reduce(
      function findMax(current: number, next: OrNullable<number>) {
        return (next ?? otherwise) > current
          ? (next ?? otherwise)
          : current;
      },
      otherwise,
    );
    if (max == null) return otherwise;
    return max;
  },
  scaleOf(numbers: OrNullable<OrNullable<number>[]>, otherwise: number = 0): IFindScaleReturn {
    const max = num.maxOf(numbers, otherwise);
    const scale = num.scale(max);
    return scale;
  },
  scale(max: number): IFindScaleReturn {
    let unit: OrNull<string> = null;
    let multiplier = 1;
    // no multiplier
    if (max <= 1_000) unit = null;
    // thousands
    else if (max <= 1_000_000) { unit = 'k'; multiplier = 1/1000 }
    // millions
    else if (max <= 1_000_000_000) { unit = 'm'; multiplier = 1/1_000_000 }
    // billions
    else if (max <= 1_000_000_000_000) { unit = 'b'; multiplier = 1/1_000_000_000 }
    // trillions
    else if (max <= 1_000_000_000_000_000) { unit = 't'; multiplier = 1/1_000_000_000_000 }
    // whoa.... unhandled huge number...
    else {
      console.warn('number too large to scale...');
    }
    return { multiplier, unit };
  },
}