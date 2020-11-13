import React, { useMemo } from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart, Bar,
  ResponsiveContainer,
} from 'recharts';
import { ring } from '../../helpers/ring.helper';
import { MultiDimensionalDataPoint } from '../../types/bar-chart-data-point.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import { OrUndefined } from '../../types/or-undefined.type';

export interface IFittedBarChartProps<T extends string = string> {
  borderless?: boolean;
  dontScale?: boolean;
  colours: string[];
  height: number;
  definition: MultiDimensionDataDefinition<T>
}


export function FittedBarChart<T extends string = string>(props: IFittedBarChartProps<T>) {
  const { definition, colours, height, borderless, dontScale, } = props;

  const usingColours = colours;

  const [data, bars, unit]: [MultiDimensionalDataPoint[], { colour: string, key: T, }[], OrUndefined<string>] = useMemo(() => {
    const { dimensions, points } = definition;

    let max = 0;
    points.forEach(point => {
      point.coordinates.forEach(coordinate => {
        if (coordinate > max) max = coordinate;
      });
    });

    let unit: string | undefined = undefined;
    let unitMultiplier = 1;
    if (!dontScale) {
      // no multiplier
      if (max <= 1_000) unit = undefined;
      // thousands
      else if (max <= 1_000_000) { unit = 'k'; unitMultiplier = 1/1000 }
      // millions
      else if (max <= 1_000_000_000) { unit = 'm'; unitMultiplier = 1/1_000_000 }
      // billions
      else if (max <= 1_000_000_000_000) { unit = 'b'; unitMultiplier = 1/1_000_000_000 }
      // trillions
      else if (max <= 1_000_000_000_000_000) { unit = 't'; unitMultiplier = 1/1_000_000_000_000 }
      // whoa.... unhandled huge number...
      else {
        console.warn('number too large to scale...');
      }
    }

    const data: MultiDimensionalDataPoint[] = points.map((point) => {
      const { name, coordinates } = point;
      const datum: MultiDimensionalDataPoint = { name: name ?? '' };
      dimensions.forEach((dimension, i) => { datum[dimension] = coordinates[i] * unitMultiplier; });
      return datum;
    });
    const bars = dimensions.map((dimension, i) => ({
      colour: ring(usingColours, i),
      key: dimension
    }));
    return [data, bars, unit];
  }, [definition]);

  return (
    // <WithoutFirstLoad>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit={unit} />
          {/* <Tooltip /> */}
          {bars.map(bar => (
            <Bar
              stroke={borderless ? "none" : undefined}
              key={bar.key}
              dataKey={bar.key}
              fill={bar.colour}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    // </WithoutFirstLoad>
  )
}
