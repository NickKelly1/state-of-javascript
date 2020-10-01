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
import { NpmsPackageInfos } from '../../npms-api/types/npms-package-info.type';
import { IDatum } from '../../types/datum.type';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export interface IFittedPieChartProps {
  data: IDatum[];
}

export function FittedPieChart(props: IFittedPieChartProps) {
  const { data } = props;

  return (
    <PieChart width={350} height={300}>
      <Pie
        data={data}
        cx={'50%'}
        cy={'50%'}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
        label={(datum) => datum.name}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
  )
}

