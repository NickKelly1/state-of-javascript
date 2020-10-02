import React, { Fragment, PureComponent, useMemo, useState } from 'react';
import clsx from 'clsx';
import Next, { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ssPropsHandler } from '../../src/helpers/ss-props-handler.helper';
import { Button, Grid, Link, makeStyles, Paper, Typography, withTheme } from '@material-ui/core';
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
import { PackagePopularityPieChart } from '../../src/components/fitted-pie-chart/package-popularity-pie-chart';
import { PackageScorePieChart } from '../../src/components/fitted-pie-chart/package-score-pie-chart';
import { FittedPieChart } from '../../src/components/fitted-pie-chart/fitted-pie-chart';
import { NpmPackagesDashboard } from '../../src/components/dashboards/npm-packages-dashboard/npm-packages-dashboard';
import { WithAttempted } from '../../src/components/with-attempted/with-attempted';

interface IHomeProps {
  resources: Attempt<ResourceSdkResource[], NormalisedError>;
  stories: Attempt<ArticleSdkResource[], NormalisedError>;
  tools: Attempt<ResourceSdkResource[], NormalisedError>;
  httpServerPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  wssPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  ormPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  cmsPackages: Attempt<NpmsPackageInfos, NormalisedError>;
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
  const { resources, tools, stories, httpServerPackages, wssPackages, ormPackages, cmsPackages } = props;
  const classes = useStyles();
  const [moreHttpServerStats, setMoreHttpServerStats] = useState(false);
  const [moreWsServerStats, setMoreWsServerStats] = useState(false);

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
                  {(packages) => <NpmPackagesDashboard title="Frameworks" packages={packages} />}
                </WithAttempted>
              </Grid>
              <Grid item xs={12} md={6}>
                <WithAttempted attempted={ormPackages}>
                  {(packages) => <NpmPackagesDashboard title="ORM" packages={packages} />}
                </WithAttempted>
              </Grid>
              <Grid item xs={12} md={6}>
                <WithAttempted attempted={wssPackages}>
                  {(packages) => <NpmPackagesDashboard title="Web Socket Servers" packages={packages} />}
                </WithAttempted>
              </Grid>
              <Grid item xs={12} md={6}>
                <WithAttempted attempted={cmsPackages}>
                  {(packages) => <NpmPackagesDashboard title="CMS" packages={packages} />}
                </WithAttempted>
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
                    <WithAttempted attempted={stories}>
                      {(success) => (
                        <>
                          {success.map((story, i) => (
                            <Fragment key={i}>
                              <Grid item xs={12} sm={12} lg={12}>
                                <ArticleCard article={story} />
                              </Grid>
                            </Fragment>
                          ))}
                        </>
                      )}
                    </WithAttempted>
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
                    <WithAttempted attempted={tools}>
                      {(success) => (
                        <>
                          {success.map((tool, i) => (
                            <Fragment key={i}>
                              <Grid item xs={12} sm={6} lg={4}>
                                <ToolCard tool={tool} />
                              </Grid>
                            </Fragment>
                          ))}
                        </>
                      )}
                    </WithAttempted>
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
    '@nestjs/core',
    'koa',
    '@hapi/hapi',
    'sails',
  ] });

  const wssPackagesRequest = npmsApi.packageInfos({ names: [
    'socket.io',
    'ws',
    'websocket',
  ] });

  const ormPackagesRequest = npmsApi.packageInfos({ names: [
    'typeorm',
    'rxdb',
    'mongoose',
    'sequelize',
    'loopback',
  ] });

  const cmsPackagesRequest = npmsApi.packageInfos({ names: [
    'strapi',
    // 'keystone',
    'ghost',
    'loopback',
  ] });

  const [
    resources,
    tools,
    stories,
    httpServerPackages,
    wssPackages,
    ormPackages,
    cmsPackages,
  ] = await Promise.all([
    attemptAsync(resourcesRequest),
    attemptAsync(toolsRequest),
    attemptAsync(storiesRequest),
    attemptAsync(httpServerPackagesRequest),
    attemptAsync(wssPackagesRequest),
    attemptAsync(ormPackagesRequest),
    attemptAsync(cmsPackagesRequest),
  ]);

  return {
    props: {
      resources,
      stories,
      tools,
      httpServerPackages,
      wssPackages,
      ormPackages,
      cmsPackages,
    }
  }
})

export default HomePage;