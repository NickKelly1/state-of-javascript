import { makeStyles, useTheme } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
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
import { shuffle } from '../../helpers/shuffle.helper';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { ThemeColourOmissions, useRandomThemeColours } from '../../hooks/use-random-theme-colors.hook';
import { NpmsPackageInfos } from '../../npms-api/types/npms-package-info.type';
import { ThemeColourType } from '../../theme';
import { PieChartDatum } from '../../types/pie-chart-datum.type';
import { WithoutFirstLoad } from '../without-first-load/without-first-load';


const useStyles = makeStyles((theme) => ({
  //
}));


export interface IFittedDoublePieChartProps {
  outer: PieChartDatum[];
  inner: PieChartDatum[];
  colours: string[];
  radius: number;
}


export function FittedDoublePieChart(props: IFittedDoublePieChartProps) {
  const { outer, inner, colours, radius } = props;
  const classes = useStyles();

  const randomColours = useRandomDashColours();
  const usingColours = colours ?? randomColours;

  const maxRadius = radius;
  const cut = percent(maxRadius, 10);
  const outer_outer = maxRadius;
  const outer_inner = outer_outer - cut * 2;
  const inner_outer = outer_inner - cut;
  const inner_inner = inner_outer - cut * 2;

  return (
    <WithoutFirstLoad>
      <PieChart
        width={2 * maxRadius + 10}
        height={2 * maxRadius + 10}
      >
        <Pie
          // legendType="circle"
          labelLine={true}
          data={inner}
          cx={'50%'}
          cy={'50%'}
          innerRadius={inner_inner}
          outerRadius={inner_outer}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          // label={(datum) => datum.name}
        >
          {inner.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={ring(usingColours, index)}
            />
          ))}
        </Pie>
        <Pie
          data={outer}
          cx={'50%'}
          cy={'50%'}
          innerRadius={outer_inner}
          outerRadius={outer_outer}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          // label={(datum) => datum.name}
        >
          {outer.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={ring(usingColours, index)}
            />
          ))}
        </Pie>
      </PieChart>
    </WithoutFirstLoad>
  )
}

