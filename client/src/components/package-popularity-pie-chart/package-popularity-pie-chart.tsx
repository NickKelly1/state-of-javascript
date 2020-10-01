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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface IPackagePopularityPieChartProps {
  packages: NpmsPackageInfos;
}

interface IPieChartDatum { name: string, value: number };

export function PackagePopularityPieChart(props: IPackagePopularityPieChartProps) {
  const { packages } = props;

  const data: IPieChartDatum[] = useMemo(() => {
    const entries = Object.entries(packages);
    const data: IPieChartDatum[] = [];
    entries.forEach(([name, pkg]) => {
      const downloads = pkg?.evaluation?.popularity?.downloadsCount;
      if (downloads != undefined) {
        // const value = Math.log(downloads + 1);
        // balance with sqrt...
        const value = Math.pow(downloads, 0.5);
        data.push({ name, value });
      } else {
        console.warn(`No show package "${name}"`);
      }
    });
    return data;
  }, [packages]);

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
