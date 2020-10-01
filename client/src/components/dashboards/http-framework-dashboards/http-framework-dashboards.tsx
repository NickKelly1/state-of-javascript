import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { FullscreenExitRounded } from '@material-ui/icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Attempt } from '../../../helpers/attempted.helper';
import { NormalisedError } from '../../../helpers/normalise-error.helper';
import { makePackageChartData } from '../../../hooks/make-package-chart-data.hook';
import { NpmsPackageInfos } from '../../../npms-api/types/npms-package-info.type';
import { DoubleFittedPieChart } from '../../package-popularity-pie-chart/double-fitted-pie-chart';
import { FittedPieChart } from '../../package-popularity-pie-chart/fitted-pie-chart';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  dash: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));


export interface IHttpFrameworkDashboardsProps {
  packages: NpmsPackageInfos;
}

function makeData<T>(packages: NpmsPackageInfos, fn: T) {
  // return useMemo(() => {

  // }, [packages]);
  // return useCallback(() => {

  // }, [packages]);
}

export function HttpFrameworkDashboard(props: IHttpFrameworkDashboardsProps) {
  const { packages } = props;
  const classes = useStyles();

  const [more, setMore] = useState(false);

  const popularity = makePackageChartData(packages, ({ pkg }) => pkg.evaluation?.popularity?.downloadsCount);
  const acceleration = makePackageChartData(packages, ({ pkg }) => pkg.evaluation?.popularity?.downloadsAcceleration / (pkg.evaluation?.popularity?.downloadsCount || 1));
  const scores = makePackageChartData(packages, ({ pkg }) => pkg.score?.final);

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid className={classes.dash} item xs={12}>
          <Typography variant="h6" component="h4">
            Popularity
          </Typography>
          {/* <FittedPieChart data={popularity}/> */}
          <DoubleFittedPieChart outer={popularity} inner={acceleration} />
        </Grid>
        <Grid className="centered" item xs={12}>
          <Button onClick={() => setMore(!more)}>
            {more && 'Less...'}
            {!more && 'More...'}
          </Button>
        </Grid>
        {more && (
          <Grid className={classes.dash} item xs={12}>
            <Typography variant="h6" component="h4">
              Score
            </Typography>
            <FittedPieChart data={scores} />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}