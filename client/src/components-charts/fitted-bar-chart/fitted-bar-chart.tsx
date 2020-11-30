import React, { useMemo } from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart, Bar,
  ResponsiveContainer,
} from 'recharts';
import { ist } from '../../helpers/ist.helper';
import { num } from '../../helpers/num.helper';
import { ring } from '../../helpers/ring.helper';
import { MultiDimensionalDataPoint } from '../../types/bar-chart-data-point.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import { OrNull } from '../../types/or-null.type';
import { OrNullable } from '../../types/or-nullable.type';
import { OrUndefined } from '../../types/or-undefined.type';

export interface IFittedBarChartProps<T extends string = string> {
  borderless?: boolean;
  dontScale?: boolean;
  colours: string[];
  height: number;
  definition: MultiDimensionDataDefinition<T>;
}


export function FittedBarChart<T extends string = string>(props: IFittedBarChartProps<T>) {
  const { definition, colours, height, borderless, dontScale, } = props;

  const usingColours = colours;

  const [data, bars, unit]: [MultiDimensionalDataPoint[], { colour: string, key: T, }[], OrNullable<string>] = useMemo(() => {
    const { dimensions, points } = definition;
    const { multiplier, unit } = dontScale
      ? { multiplier: 0, unit: null }
      : num.scaleOf(points.flatMap(point => point.coordinates), 0);
    const data: MultiDimensionalDataPoint[] = points.map((point) => {
      const { name, coordinates } = point;
      const datum: MultiDimensionalDataPoint = { name: name ?? '' };
      dimensions.forEach((dimension, i) => {
        const coord = coordinates[i]
        if (ist.nullable(coord)) datum[dimension] = null;
        else datum[dimension] = coord  * multiplier;
      });
      return datum;
    });
    const bars = dimensions.map((dimension, i) => ({
      colour: ring(usingColours, i),
      key: dimension
    }));
    return [data, bars, unit];
  }, [definition, dontScale]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit={unit ?? undefined} />
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
  )
}
