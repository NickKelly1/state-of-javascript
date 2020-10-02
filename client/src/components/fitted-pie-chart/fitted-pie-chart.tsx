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
import { percent } from '../../helpers/percent.helper';
import { ring } from '../../helpers/ring.helper';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { NpmsPackageInfos } from '../../npms-api/types/npms-package-info.type';
import { PieChartDatum } from '../../types/pie-chart-datum.type';
import { WithoutFirstLoad } from '../without-first-load/without-first-load';

export interface IFittedPieChartProps {
  data: PieChartDatum[];
  colours?: string[];
  radius: number;
}

export function FittedPieChart(props: IFittedPieChartProps) {
  const { data, colours, radius } = props;

  const randomColours = useRandomDashColours();
  const useColours = colours ?? randomColours;

  const maxRadius = radius;
  const cut = percent(maxRadius, 30);
  const outer_outer = maxRadius;
  const outer_inner = outer_outer - cut * 1;

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
          paddingAngle={5}
          dataKey="value"
          // label={(datum) => datum.name}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={ring(useColours, index)}
            />
          ))}
        </Pie>
      </PieChart>
    </WithoutFirstLoad>
  )
}

