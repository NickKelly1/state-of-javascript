import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { FullscreenExitRounded } from '@material-ui/icons';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Attempt } from '../../../helpers/attempted.helper';
import { NormalisedError } from '../../../helpers/normalise-error.helper';
import { makePackageChartData } from '../../../hooks/make-package-chart-data.hook';
import { useRandomDashColours } from '../../../hooks/use-random-dash-colors.hook';
import { NpmsPackageInfos, NpmsPackageInfo_Collected_Npm_Downloads } from '../../../npms-api/types/npms-package-info.type';
import { FittedDoublePieChart } from '../../fitted-double-pie-chart/fitted-double-pie-chart';
import { FittedPieChart } from '../../fitted-pie-chart/fitted-pie-chart';
import seedRandom from 'seed-random';
import { ring } from '../../../helpers/ring.helper';
import { Legend } from '../../legend/legend';
import { Col } from '../../col/col';
import { FittedBarChart, IFittedBarChartProps } from '../../fitted-bar-chart/fitted-bar-chart';
import { FittedAreaChart } from '../../fitted-area-chart/fitted-area-chart';
import { MultiDimensionDataDefinition } from '../../../types/multi-dimensional-data-definition.type';
import { OrNullable } from '../../../types/or-nullable.type';

function downloadFrequency(downloads: OrNullable<NpmsPackageInfo_Collected_Npm_Downloads>): number {
  // return downloads?.count ?? 0;
  if (!downloads?.from || !downloads?.to) return 0;

  const from = new Date(downloads.from);
  if (Number.isNaN(from.valueOf())) return 0;

  const to = new Date(downloads.to);
  if (Number.isNaN(to.valueOf())) return 0;

  const days = ((to.valueOf() - from.valueOf()) / (1000 * 60 * 60 * 24))
  const dls = downloads.count || 0;
  const perDay = Math.ceil(dls / (days) || 1);
  return perDay;
}

function ym(date: OrNullable<string>): string {
  if (!date) return '?';
  const deserialized = new Date(date); 
  if (Number.isNaN(deserialized.valueOf())) return '?';
  return `${deserialized.getUTCFullYear()}-${deserialized.getUTCMonth() + 1}`;
}


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  dash: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));


export interface INpmPackageDashboardsProps {
  title: string;
  packages: NpmsPackageInfos;
}

export function NpmPackagesDashboard(props: INpmPackageDashboardsProps) {
  const { title, packages } = props;
  const classes = useStyles();

  const [more, setMore] = useState(false);

  const packageNames = useMemo(() => Object.keys(packages), [packages]);
  const popularity = makePackageChartData(packages, ({ pkg }) => pkg.evaluation?.popularity?.downloadsCount);
  const absoluteAcceperation = makePackageChartData(packages, ({ pkg }) => (pkg.evaluation?.popularity?.downloadsAcceleration));
  const relativeAcceleration = makePackageChartData(packages, ({ pkg }) => (pkg.evaluation?.popularity?.downloadsAcceleration || 0) / (pkg.evaluation?.popularity?.downloadsCount || 1));
  const scores = makePackageChartData(packages, ({ pkg }) => pkg.score?.final);
  const random = useMemo(() => seedRandom(NpmPackagesDashboard.name), []);
  const colours = useRandomDashColours({ random });

  const barSummaryScores: MultiDimensionDataDefinition = useMemo((): MultiDimensionDataDefinition => ({
    dimensions: packageNames,
    points: [{
      name: 'maintenance',
      coordinates: packageNames.map(name => Math.floor(100 * (packages[name]?.score?.detail?.maintenance || 0))),
    }, {
      name: 'popularity',
      coordinates: packageNames.map(name => Math.floor(100 * (packages[name]?.score?.detail?.popularity || 0))),
    }, {
      name: 'quality',
      coordinates: packageNames.map(name => Math.floor(100 * (packages[name]?.score?.detail?.quality || 0))),
    }, {
      name: 'total',
      coordinates: packageNames.map(name => Math.floor(100 * (packages[name]?.score?.final || 0))),
    }],
  }), [packages, packageNames]);

  const githubStarsBars: MultiDimensionDataDefinition = useMemo((): MultiDimensionDataDefinition => ({
    dimensions: packageNames,
    points: [{
      name: 'stars',
      coordinates: packageNames.map(name => packages[name]?.collected?.github?.starsCount || 0),
    }],
  }), [packages, packageNames]);

  const githubCommitsBars: MultiDimensionDataDefinition = useMemo((): MultiDimensionDataDefinition => ({
    dimensions: packageNames,
    points: [{
      name: 'recent commits',
      coordinates: packageNames.map(name => packages[name]?.collected?.github?.commits?.reduce((p, n) => p + (n.count || 0), 0) || 0),
    }],
  }), [packages, packageNames]);

  const githubOpenIssuesBars: MultiDimensionDataDefinition = useMemo((): MultiDimensionDataDefinition => ({
    dimensions: packageNames,
    points: [{
      name: 'open issues',
      coordinates: packageNames.map(name => packages[name]?.collected?.github?.issues?.openCount || 0),
    }],
  }), [packages, packageNames]);

  const githubClosedIssuesBars: MultiDimensionDataDefinition = useMemo((): MultiDimensionDataDefinition => ({
    dimensions: packageNames,
    points: [{
      name: 'closed issues',
      coordinates: packageNames.map(name => (packages[name]?.collected?.github?.issues?.count || 0) - (packages[name]?.collected?.github?.issues?.openCount || 0)),
    }],
  }), [packages, packageNames]);

  const githubForksBars: MultiDimensionDataDefinition = useMemo((): MultiDimensionDataDefinition => ({
    dimensions: packageNames,
    points: [{
      name: 'forks',
      coordinates: packageNames.map(name => packages[name]?.collected?.github?.forksCount || 0),
    }],
  }), [packages, packageNames]);

  const githubSubscribersBars: MultiDimensionDataDefinition = useMemo((): MultiDimensionDataDefinition => ({
    dimensions: packageNames,
    points: [{
      name: 'subscribers',
      coordinates: packageNames.map(name => packages[name]?.collected?.github?.subscribersCount || 0),
    }],
  }), [packages, packageNames]);

  const npmDownloadFrequencyToDate: MultiDimensionDataDefinition = useMemo((): MultiDimensionDataDefinition => ({
    dimensions: packageNames,
    points: Array(
      Object
        .values(packages)
        .reduce((running, pkg) => Math.max(running, pkg?.collected?.npm?.downloads?.length || 0), 0)
      )
      .fill(0)
      .map((_, i) => ({
        name: ym(packages[packageNames[0]]?.collected?.npm?.downloads?.[i].from),
        coordinates: packageNames.map(name => downloadFrequency(packages[name]?.collected?.npm?.downloads?.[i])),
      }))
      .reverse(),
  }), [packages, packageNames]);

  return (
    <Paper className={classes.paper}>
      <Grid container>

        <Grid className={classes.dash} item xs={12}>
           {/* Title */}
          <Typography variant="h5" component="h3">
            {title}
          </Typography>

          <Grid container>
            <Grid className="centered" item xs={12} sm={4}>
              {/* Legend */}
              <Legend colours={colours} names={packageNames} />
            </Grid>

            <Grid className="centered" item xs={6} sm={4}>
              <Col>
                <Typography className="centered" component="h4" variant="h6">
                  Downloads
                </Typography>
                <FittedPieChart
                  radius={50}
                  colours={colours}
                  data={popularity}
                />
              </Col>
            </Grid>
            <Grid className="centered" item xs={6} sm={4}>
              <Col>
                <Typography className="centered" component="h4" variant="h6">
                  Growth
                </Typography>
                <FittedPieChart
                  radius={50}
                  colours={colours}
                  data={relativeAcceleration}
                />
              </Col>
            </Grid>
            <Grid className="centered" item xs={12}>
              <Col className="full-width" >
                <Typography className="centered" component="h4" variant="h6">
                  Summary
                </Typography>
                <FittedBarChart
                  height={100}
                  definition={barSummaryScores}
                  colours={colours}
                />
              </Col>
            </Grid>
          </Grid>
        </Grid>

        <Grid className="centered" item xs={12}>
          <Button onClick={() => setMore(!more)}>
            <u>
              {more && 'Less...'}
              {!more && 'More...'}
            </u>
          </Button>
        </Grid>

        {more && (
          <>
            <Grid className="centered" item xs={12}>
              <Col className="full-width" >
                <Typography className="centered" component="h4" variant="h6">
                  GitHub
                </Typography>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <FittedBarChart
                      height={100}
                      definition={githubStarsBars}
                      colours={colours}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FittedBarChart
                      height={100}
                      definition={githubCommitsBars}
                      colours={colours}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FittedBarChart
                      height={100}
                      definition={githubOpenIssuesBars}
                      colours={colours}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FittedBarChart
                      height={100}
                      definition={githubClosedIssuesBars}
                      colours={colours}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FittedBarChart
                      height={100}
                      definition={githubForksBars}
                      colours={colours}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FittedBarChart
                      height={100}
                      definition={githubSubscribersBars}
                      colours={colours}
                    />
                  </Grid>
                </Grid>
              </Col>
            </Grid>
            <Grid className="centered" item xs={12}>
              <Col className="full-width" >
                <Typography className="centered" component="h4" variant="h6">
                  Npm
                </Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <Col>
                      <Typography className="centered" component="h5" variant="h6">
                        Download frequency
                      </Typography>
                      <FittedAreaChart
                        height={200}
                        definition={npmDownloadFrequencyToDate}
                        colours={colours}
                      />
                    </Col>
                  </Grid>
                </Grid>
              </Col>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}