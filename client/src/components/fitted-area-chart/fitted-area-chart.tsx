import React, { useMemo } from 'react';
import shortid from 'shortid';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ring } from '../../helpers/ring.helper';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { MultiDimensionalDataPoint } from '../../types/bar-chart-data-point.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';

interface IFittedAreaChartProps {
  height: number;
  colours?: string[];
  definition: MultiDimensionDataDefinition;
}

export function FittedAreaChart(props: IFittedAreaChartProps) {
  const { height, definition, colours } = props;

  const randomColours = useRandomDashColours();
  const usingColours = colours ?? randomColours;

  const [data, bars]: [MultiDimensionalDataPoint[], { colour: string, key: string }[]] = useMemo(() => {
    const { dimensions, points } = definition;
    const data: MultiDimensionalDataPoint[] = points.map((point) => {
      const { name, coordinates } = point;
      const datum: MultiDimensionalDataPoint = { name };
      dimensions.forEach((dimension, i) => { datum[dimension] = coordinates[i]; });
      return datum;
    });
    const bars = dimensions.map((dimension, i) => ({
      colour: ring(usingColours, i),
      key: dimension
    }));
    return [data, bars];
  }, [definition]);
  const dimensionIds = useMemo(() => definition.dimensions.map((_, i) => ({
    id: shortid(),
    colour: ring(usingColours, i),
  })), [definition]);

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
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        {/* <Tooltip /> */}
        {bars.map((bar, i) => (
          <Area
            type="monotone"
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
