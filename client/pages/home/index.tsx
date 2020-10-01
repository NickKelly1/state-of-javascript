import React, { Fragment, PureComponent, useMemo, useState } from 'react';
import clsx from 'clsx';
import Next, { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ssPropsHandler } from '../../src/helpers/ss-props-handler.helper';
import { Button, Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core';
import { ArticleSdkResource } from '../../src/sdk/types/article.sdk.resource';
import { ResourceSdkResource } from '../../src/sdk/types/resource.sdk.resource';
import { ArticleCard } from '../../src/components/article-card/article-card';
import { SdkFilterEq, SdkFilterNIn, SdkQuery, SdkSort, SdkSortDir } from '../../src/sdk/sdk-query.type';
import { Sort } from '@material-ui/icons';
import { ToolsCard } from '../../src/components/resources-card/tools-card';
import { ToolCard } from '../../src/components/tool-card/tool-card';
import { SdkResourceCategory } from '../../src/sdk/sdk-resource-category.enum';
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
import { NpmsPackageInfos } from '../../src/npms-api/types/npms-package-info.type';
import { Attempt, attemptAsync, success, unwrapAttempt } from '../../src/helpers/attempted.helper';
import { NormalisedError } from '../../src/helpers/normalise-error.helper';
import { fail } from 'assert';
import { PackagePopularityPieChart } from '../../src/components/package-popularity-pie-chart/package-popularity-pie-chart';
import { PackageScorePieChart } from '../../src/components/package-popularity-pie-chart/package-score-pie-chart';
import { FittedPieChart, IPieChartDatum } from '../../src/components/package-popularity-pie-chart/fitted-pie-chart';
import { HttpFrameworkDashboard } from '../../src/components/dashboards/http-framework-dashboards/http-framework-dashboards';
import { WithAttempted } from '../../src/components/with-attempted/with-attempted';

interface IHomeProps {
  resources: Attempt<ResourceSdkResource[], NormalisedError>;
  stories: Attempt<ArticleSdkResource[], NormalisedError>;
  tools: Attempt<ResourceSdkResource[], NormalisedError>;
  httpServerPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  wssPackages: Attempt<NpmsPackageInfos, NormalisedError>;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  logo: {
    maxHeight: '1em',
  },
  category: {
    // border: '1px white solid',
    // borderRadius: '16px'
  }
}));

function HomePage(props: IHomeProps) {
  const { resources, tools, stories, httpServerPackages, wssPackages } = props;
  const classes = useStyles();
  const [moreHttpServerStats, setMoreHttpServerStats] = useState(false);
  const [moreWsServerStats, setMoreWsServerStats] = useState(false);

  const wssPopularity: IPieChartDatum[] = useMemo(() => {
    const entries = Object.entries(wssPackages);
    const data: IPieChartDatum[] = [];
    entries.forEach(([name, pkg]) => {
      const score = pkg?.score?.final;
      const downloads = pkg?.evaluation?.popularity?.downloadsCount;
      if (score != undefined && downloads != undefined) {
        const value = score * Math.sqrt(downloads);
        data.push({ name, value });
      } else {
        console.warn(`Cannot show package "${name}"`);
      }
    });
    return data;
  }, [wssPackages]);

  return (
    <>
      <Grid container spacing={2}>
        {/* stories */}
        <Grid className={classes.category} item xs={12}>
          <section>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  Ecosystem
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <WithAttempted attempted={httpServerPackages}>
                  {(packages) => <HttpFrameworkDashboard packages={packages} />}
                </WithAttempted>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Grid container>
                    <Grid className="centered" item xs={12}>
                      <Typography variant="h6" component="h3">
                        Web Socket Servers
                      </Typography>
                    </Grid>
                    <Grid className="centered" item xs={12}>
                      <PackagePopularityPieChart packages={unwrapAttempt(wssPackages)} />
                    </Grid>
                    <Grid className="centered" item xs={12}>
                      <Button onClick={() => setMoreWsServerStats(!moreWsServerStats)}>
                        {moreWsServerStats && 'Less...'}
                        {!moreWsServerStats && 'More...'}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </section>
        </Grid>
        <Grid className={classes.category} item xs={12}>
          <section>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  News
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <section>
                  <Grid container spacing={2}>
                    {unwrapAttempt(stories).map((story, i) => (
                      <Fragment key={i}>
                        <Grid item xs={12} sm={12} lg={12}>
                          <ArticleCard article={story} />
                        </Grid>
                      </Fragment>
                    ))}
                  </Grid>
                </section>
              </Grid>
            </Grid>
          </section>
        </Grid>

        {/* stories */}
        <Grid item xs={12}>
          <section>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  Tooling
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <section>
                  <Grid container spacing={2}>
                    {unwrapAttempt(tools).map((tool, i) => (
                      <Fragment key={i}>
                        <Grid item xs={12} sm={6} lg={4}>
                          <ToolCard tool={tool} />
                        </Grid>
                      </Fragment>
                    ))}
                  </Grid>
                </section>
              </Grid>
            </Grid>
          </section>
        </Grid>

        {/* <Grid item xs={12}>
          <section>
            <ToolsCard tools={tools} />
          </section>
        </Grid>

        <Grid item xs={12}>
          <section>
            <ResourcesCard resources={resources} />
          </section>
        </Grid> */}
      </Grid>
    </>
  );
}


export const getServerSideProps = ssPropsHandler<IHomeProps>(async ({ ctx, sdk, npmsApi }) => {
  const resourceQuery = SdkQuery.create();
  resourceQuery.addSort(SdkSort.create({ field: 'id', value: SdkSortDir.Desc }));
  resourceQuery.addFilter(SdkFilterNIn.create({ field: 'resource_category', values: [SdkResourceCategory.Tooling] }))
  resourceQuery.setLimit(10);
  resourceQuery.setSkip(0);
  const resourcesRequest = sdk.resources({ query: resourceQuery });

  const toolsQuery = SdkQuery.create();
  toolsQuery.addSort(SdkSort.create({ field: 'id', value: SdkSortDir.Desc }));
  toolsQuery.addFilter(SdkFilterEq.create({ field: 'resource_category', value: SdkResourceCategory.Tooling }))
  toolsQuery.setLimit(10);
  toolsQuery.setSkip(0);
  const toolsRequest = sdk.resources({ query: toolsQuery });

  const storiesQuery = SdkQuery.create();
  storiesQuery.addSort(SdkSort.create({ field: 'created_at', value: SdkSortDir.Desc }));
  storiesQuery.setLimit(10);
  storiesQuery.setSkip(0);
  const storiesRequest = sdk.stories({ query: storiesQuery });

  const httpServerPackagesRequest = npmsApi.packageInfos({ names: [
    'express',
    // '@nestjs/core',
    'koa',
    // 'strapi',
    '@hapi/hapi',
    // 'sails',
  ] });

  const wssPackagesRequest = npmsApi.packageInfos({ names: [
    'socket.io',
    'ws',
    'websocket',
  ] });

  const [
    resources,
    tools,
    stories,
    httpServerPackages,
    wssPackages,
  ] = await Promise.all([
    attemptAsync(resourcesRequest),
    attemptAsync(toolsRequest),
    attemptAsync(storiesRequest),
    attemptAsync(httpServerPackagesRequest),
    attemptAsync(wssPackagesRequest),
  ]);

  console.log('FINITO');
  console.log({
    resources,
    tools,
    stories,
    httpServerPackages,
    wssPackages,
  });

  return {
    props: {
      resources,
      stories,
      tools,
      httpServerPackages,
      wssPackages,
    }
  }
})

export default HomePage;