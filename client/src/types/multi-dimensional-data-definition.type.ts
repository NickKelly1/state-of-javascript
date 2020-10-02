
export interface MultiDimensionDataDefinition<T extends string = string> {
  dimensions: T[];
  points: { name?: string, coordinates: number[] }[];
}
