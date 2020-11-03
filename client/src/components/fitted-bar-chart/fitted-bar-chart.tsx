import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Sector,
  Cell,
  BarChart, Bar, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { percent } from '../../helpers/percent.helper';
import { ring } from '../../helpers/ring.helper';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { NpmsPackageInfos } from '../../npms-api/types/npms-package-info.type';
import { MultiDimensionalDataPoint } from '../../types/bar-chart-data-point.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import { PieChartDatum } from '../../types/pie-chart-datum.type';
import { WithoutFirstLoad } from '../without-first-load/without-first-load';

export interface IFittedBarChartProps<T extends string = string> {
  borderless?: boolean;
  colours: string[];
  height: number;
  definition: MultiDimensionDataDefinition<T>
}


export function FittedBarChart<T extends string = string>(props: IFittedBarChartProps<T>) {
  const { definition, colours, height, borderless, } = props;

  const usingColours = colours;

  const [data, bars]: [MultiDimensionalDataPoint[], { colour: string, key: T }[]] = useMemo(() => {
    const { dimensions, points } = definition;
    const data: MultiDimensionalDataPoint[] = points.map((point) => {
      const { name, coordinates } = point;
      const datum: MultiDimensionalDataPoint = { name: name ?? '' };
      dimensions.forEach((dimension, i) => { datum[dimension] = coordinates[i]; });
      return datum;
    });
    const bars = dimensions.map((dimension, i) => ({
      colour: ring(usingColours, i),
      key: dimension
    }));
    return [data, bars];
  }, [definition]);

  return (
    <WithoutFirstLoad>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
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
    </WithoutFirstLoad>
  )
}
