import { OrNull } from "./or-null.type";
import { OrUndefined } from "./or-undefined.type";

export interface MultiDimensionDataDefinition<T extends string = string> {
  dimensions: T[];
  points: { name?: string, coordinates: OrNull<number>[] }[];
}
