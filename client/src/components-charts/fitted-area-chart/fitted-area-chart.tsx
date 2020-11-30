import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ist } from '../../helpers/ist.helper';
import { num } from '../../helpers/num.helper';
import { ring } from '../../helpers/ring.helper';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { MultiDimensionalDataPoint } from '../../types/bar-chart-data-point.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import { OrNullable } from '../../types/or-nullable.type';

interface IFittedAreaChartProps<T extends string = string> {
  borderless?: boolean;
  dontScale?: boolean;
  height: number;
  colours: string[];
  definition: MultiDimensionDataDefinition<T>;
}

export function FittedAreaChart<T extends string = string>(props: IFittedAreaChartProps<T>) {
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
  }, [definition]);

  const dimensionIds = useMemo(() => definition.dimensions.map((_, i) => ({
    id: nanoid(),
    colour: ring(colours, i),
  })), [definition, colours]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {dimensionIds.map(({ id, colour }) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colour} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colour} stopOpacity={0}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit={unit ?? undefined} />
        {/* <Tooltip /> */}
        {bars.map((bar, i) => (
          <Area
            type="monotone"
            stroke={borderless ? "none" : undefined}
            key={bar.key}
            dataKey={bar.key}
            fill={`url(#${dimensionIds[i].id})`}
            fillOpacity={1}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
