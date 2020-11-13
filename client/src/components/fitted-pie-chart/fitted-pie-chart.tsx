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
} from 'recharts';
import { WithoutFirstLoad } from '../../components-hoc/without-first-load/without-first-load';
import { percent } from '../../helpers/percent.helper';
import { ring } from '../../helpers/ring.helper';
import { PieChartDatum } from '../../types/pie-chart-datum.type';

export interface IFittedPieChartProps {
  data: PieChartDatum[];
  colours: string[];
  radius: number;
  filled?: boolean;
  borderless?: boolean;
}

export function FittedPieChart(props: IFittedPieChartProps) {
  const { data, colours, radius, filled, borderless } = props;

  const maxRadius = radius;
  const cut = percent(maxRadius, 30);
  const outer_outer = maxRadius;
  const outer_inner = filled ? 0 : outer_outer - cut * 1;

  return (
    <WithoutFirstLoad>
      <PieChart
        width={2 * maxRadius + 10}
        height={2 * maxRadius + 10}
      >
        <Pie
          data={data}
          cx={'50%'}
          cy={'50%'}
          innerRadius={outer_inner}
          outerRadius={outer_outer}
          fill="#8884d8"
          paddingAngle={(outer_inner === 0) ? 0 : 5}
          dataKey="value"
          stroke={borderless ? "none" : undefined}
          // label={(datum) => datum.name}
        >
          {data.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={ring(colours, i)}
            />
          ))}
        </Pie>
      </PieChart>
    </WithoutFirstLoad>
  )
}

