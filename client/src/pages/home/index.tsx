import React, { Fragment, PureComponent, useMemo, useState } from 'react';
import clsx from 'clsx';
import Next, { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { serverSidePropsHandler } from '../../helpers/server-side-props-handler.helper';
import { Button, Grid, Link, makeStyles, Paper, Typography, withTheme } from '@material-ui/core';
import { ArticleCmsResource } from '../../cms/types/article.cms.resource';
import { ResourceCmsResource } from '../../cms/types/resource.cms.resource';
import { ArticleCard } from '../../components/article-card/article-card';
import { CmsFilterEq, CmsFilterNIn, CmsQuery, CmsSort, CmsSortDir } from '../../cms/cms-query.type';
import { Sort } from '@material-ui/icons';
import { ToolsCard } from '../../components/resources-card/tools-card';
import { ToolCard } from '../../components/tool-card/tool-card';
import { CmsResourceCategory } from '../../cms/cms-resource-category.enum';
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
import { Attempt, attemptAsync, } from '../../helpers/attempted.helper';
import { NormalisedError } from '../../helpers/normalise-error.helper';
import { NpmPackagesDashboard } from '../../components/npm-packages-dashboard/npm-packages-dashboard';
import { WithAttempted } from '../../components/with-attempted/with-attempted';
import { staticPathsHandler, staticPropsHandler } from '../../helpers/static-props-handler.helper';
import { Cms } from '../../cms/cms';
import { NpmsApi } from '../../npms-api/npms-api';

interface IHomeProps {
  resources: Attempt<ResourceCmsResource[], NormalisedError>;
  stories: Attempt<ArticleCmsResource[], NormalisedError>;
  tools: Attempt<ResourceCmsResource[], NormalisedError>;
  httpServerPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  // wssPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  ormPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  // cmsPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  frontendPackages: Attempt<NpmsPackageInfos, NormalisedError>;
  fullstackPackages: Attempt<NpmsPackageInfos, NormalisedError>;
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
  const {
    resources,
    tools,
    stories,
    httpServerPackages,
    // wssPackages,
    ormPackages,
    // cmsPackages,
    frontendPackages,
    fullstackPackages,
  } = props;
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
                  {(packages) => <NpmPackagesDashboard title="Backend" packages={packages} />}
                </WithAttempted>
              </Grid>
              <Grid item xs={12} md={6}>
                <WithAttempted attempted={frontendPackages}>
                  {(packages) => <NpmPackagesDashboard title="Frontend" packages={packages} />}
                </WithAttempted>
              </Grid>
              <Grid item xs={12} md={6}>
                <WithAttempted attempted={fullstackPackages}>
                  {(packages) => <NpmPackagesDashboard title="Fullstack" packages={packages} />}
                </WithAttempted>
              </Grid>
              <Grid item xs={12} md={6}>
                <WithAttempted attempted={ormPackages}>
                  {(packages) => <NpmPackagesDashboard title="ORM" packages={packages} />}
                </WithAttempted>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <WithAttempted attempted={cmsPackages}>
                  {(packages) => <NpmPackagesDashboard title="CMS" packages={packages} />}
                </WithAttempted>
              </Grid> */}
              {/* <Grid item xs={12} md={6}>
                <WithAttempted attempted={wssPackages}>
                  {(packages) => <NpmPackagesDashboard title="Web Socket Servers" packages={packages} />}
                </WithAttempted>
              </Grid> */}
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

async function getProps(args: { cms: Cms, npmsApi: NpmsApi }): Promise<IHomeProps> {
  const { cms, npmsApi } = args
  const resourceQuery = CmsQuery.create();
  resourceQuery.addSort(CmsSort.create({ field: 'id', value: CmsSortDir.Desc }));
  resourceQuery.addFilter(CmsFilterNIn.create({ field: 'resource_category', values: [CmsResourceCategory.Tooling] }))
  resourceQuery.setLimit(10);
  resourceQuery.setSkip(0);
  const resourcesRequest = cms.resources({ query: resourceQuery });

  const toolsQuery = CmsQuery.create();
  toolsQuery.addSort(CmsSort.create({ field: 'id', value: CmsSortDir.Desc }));
  toolsQuery.addFilter(CmsFilterEq.create({ field: 'resource_category', value: CmsResourceCategory.Tooling }))
  toolsQuery.setLimit(10);
  toolsQuery.setSkip(0);
  const toolsRequest = cms.resources({ query: toolsQuery });

  const storiesQuery = CmsQuery.create();
  storiesQuery.addSort(CmsSort.create({ field: 'created_at', value: CmsSortDir.Desc }));
  storiesQuery.setLimit(10);
  storiesQuery.setSkip(0);
  const storiesRequest = cms.stories({ query: storiesQuery });

  const httpServerPackagesRequest = npmsApi.packageInfos({ names: [
    'express',
    '@nestjs/core',
    'koa',
    '@hapi/hapi',
    'sails',
  ] });

  // const wssPackagesRequest = npmsApi.packageInfos({ names: [
  //   'socket.io',
  //   'ws',
  //   'websocket',
  // ] });

  const ormPackagesRequest = npmsApi.packageInfos({ names: [
    'typeorm',
    'rxdb',
    'mongoose',
    'sequelize',
    'loopback',
  ] });

  // const cmsPackagesRequest = npmsApi.packageInfos({ names: [
  //   'strapi',
  //   'ghost',
  //   'loopback',
  // ] });

  const frontendPackagesRequest = npmsApi.packageInfos({ names: [
    'react',
    'vue',
    'angular',
  ]});

  const fullstackPackagesRequest = npmsApi.packageInfos({ names: [
    'next',
    'gatsby',
  ]});

  const [
    resources,
    tools,
    stories,
    httpServerPackages,
    // wssPackages,
    ormPackages,
    // cmsPackages,
    frontendPackages,
    fullstackPackages,
  ] = await Promise.all([
    attemptAsync(resourcesRequest),
    attemptAsync(toolsRequest),
    attemptAsync(storiesRequest),
    attemptAsync(httpServerPackagesRequest),
    // attemptAsync(wssPackagesRequest),
    attemptAsync(ormPackagesRequest),
    // attemptAsync(cmsPackagesRequest),
    attemptAsync(frontendPackagesRequest),
    attemptAsync(fullstackPackagesRequest),
  ]);

  return {
    resources,
    stories,
    tools,
    httpServerPackages,
    // wssPackages,
    ormPackages,
    // cmsPackages,
    frontendPackages,
    fullstackPackages,
  }
}

// const getServerSideProps = serverSidePropsHandler<IHomeProps>(async ({ ctx, cms, npmsApi }) => {
//   const props = await getProps({ cms, npmsApi });
//   return {
//     props,
//   };
// })

export const getStaticProps = staticPropsHandler<IHomeProps>(async ({ ctx, cms, npmsApi }) => {
  const props = await getProps({ cms, npmsApi });
  return {
    props,
    // revalidate: false,
  };
});

export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
  return {
    fallback: false,
    paths: [],
  };
})

export default HomePage;