import React, {
  useCallback,
  useContext,
  useMemo,
  useState } from 'react';
import { NextPageContext } from 'next';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import SortIcon from '@material-ui/icons/Sort';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Link as MUILink,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { Attempt, attemptAsync, isSuccess, } from '../../helpers/attempted.helper';
import { staticPathsHandler, staticPropsHandler } from '../../helpers/static-props-handler.helper';
import { Cms } from '../../cms/cms';
import { NpmsApi } from '../../npms-api/npms-api';
import { gql } from 'graphql-request';
import { Api } from '../../backend-api/api';
import {
  JsPageDashboardQuery,
  JsPageDashboardQueryVariables,
} from '../../generated/graphql';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { OrNull } from '../../types/or-null.type';
import { PieChartDatum } from '../../types/pie-chart-datum.type';
import { shuffle } from '../../helpers/shuffle.helper';
import { DashColours } from '../../dashboard-theme';
import SeedRandom from 'seed-random';
import { INpmsPackageSearchOption, } from '../../components/npms/npms-package-combo-search';
import { NpmsDashboardMutateForm, } from '../../components/npms/npms-dashboard-mutate.form';
import { ApiContext } from '../../components-contexts/api.context';
import { ist } from '../../helpers/ist.helper';
import { useUpdate } from '../../hooks/use-update.hook';
import { INpmsDashboardDatasets, NpmsDashboard } from '../../components/npms/npms-dashboard';
import { ApiException } from '../../backend-api/api.exception';
import { normaliseApiException, rethrow } from '../../backend-api/normalise-api-exception.helper';
import { useQuery } from 'react-query';
import { IIdentityFn } from '../../types/identity-fn.type';
import { DebugException } from '../../components/debug-exception/debug-exception';
import { useDialog } from '../../hooks/use-dialog.hook';
import { NpmsDashboardSortForm } from '../../components/npms/npms-dashboard-sort.form.dialog';
import { flsx } from '../../helpers/flsx.helper';
import { IPageProps } from '../../types/page-props.interface';
import { WhenDebugMode } from '../../components-hoc/when-debug-mode/when-debug-mode';
import { DebugJsonDialog } from '../../components/debug-json-dialog/debug-json-dialog';
import { hidex } from '../../helpers/hidden.helper';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import { isValidDate } from '../../helpers/is-valid-date.helper';
import { OrNullable } from '../../types/or-nullable.type';
import { msToDay } from '../../helpers/ms-to.helper';
import { orNull } from '../../helpers/or-null.helper';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';

const JsPageDashboardQueryName = 'JsPageDashboardQuery';
const jsPageDashboardQuery = gql`
query JsPageDashboard(
  $dashboardOffset:Int
  $dashboardLimit:Int
  $packageOffset:Int
  $packageLimit:Int
){
  npmsDashboards(
    query:{
      limit:$dashboardLimit
      offset:$dashboardOffset
    }
  ){
    pagination{
      limit
      offset
      total
      page_number
      pages
      more
    }
    nodes{
      cursor
      can{
        show
        update
        softDelete
        hardDelete
        restore
        submit
        reject
        publish
        unpublish
        createNpmsDashboardItem
        hardDeleteNpmsDashboardItem
      }
      data{
        id
        name
      }
      relations{
        status{
          data{
            id
            name
            colour
          }
        }
        items(
          query:{
            limit:$packageLimit
            offset:$packageOffset
          }
        ){
          pagination{
            limit
            offset
            total
            page_number
            pages
            more
          }
          nodes{
            relations{
              npmsPackage{
                cursor
                can{
                  show
                  softDelete
                  hardDelete
                  restore
                }
                data{
                  id
                  name
                  last_ran_at
                  created_at
                  updated_at
                  data{
                    score{
                      final
                      detail{
                        quality
                        popularity
                        maintenance
                      }
                    }
                    evaluation{
                      quality{
                        carefulness
                        tests
                        health
                        branding
                      }
                      popularity{
                        communityInterest
                        downloadsCount
                        downloadsAcceleration
                        dependentsCount
                      }
                      maintenance{
                        releasesFrequency
                        commitsFrequency
                        openIssues
                        issuesDistribution
                      }
                    }
                    collected{
                      metadata{
                        hasTestScript
                        hasSelectiveFiles
                        name
                      }
                      github{
                        starsCount
                        forksCount
                        subscribersCount
                        commits{
                          from
                          to
                          count
                        }
                        issues{
                          count
                          openCount
                          isDisabled
                        }
                      }
                      npm{
                        starsCount
                        dependentsCount
                        dependencies
                        devDependencies
                        downloads{
                          from
                          to
                          count
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`


interface IJavaScriptPageProps {
  // dashboards: Attempt<JsPageDashboardQuery, ApiException>;
}


const useStyles = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
  logo: {
    maxHeight: '1em',
  },
}));

const defaultQueryVars: JsPageDashboardQueryVariables = {
  dashboardLimit: 6,
  dashboardOffset: 0,
  packageLimit: 1000,
  packageOffset: 0,
}

const JavaScriptPage = WithApi<IJavaScriptPageProps>((props) => {
  const { api, me } = props;

  const { data, isLoading, refetch, error, } = useQuery<JsPageDashboardQuery, ApiException>(
    // TODO: check hash integrity under diff conditions...!?! something not not working
    [ JsPageDashboardQueryName, defaultQueryVars, me.hash ],
    async (): Promise<JsPageDashboardQuery> => {
      const result = await runPageDataQuery(api, defaultQueryVars);
      return result;
    },
    {
      // TODO: SSR initial data, but also re-load initial data after shadow id loads... or something...!?
      // initialData: isSuccess(dashboards) ? dashboards.value : undefined,
    },
  );

  return (
    <Grid container spacing={2}>
      {error && (
        <Grid item xs={12}>
          <DebugException centered always exception={error} />
        </Grid>
      )}
      {isLoading && !data && (
        <Grid className="centered" item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      {data && (
        <Grid item xs={12}>
          <JavaScriptPageContent
            queryData={data}
            onStale={refetch}
          />
        </Grid>
      )}
    </Grid>
  );
});

interface IJavaScriptPageContentProps {
  queryData: JsPageDashboardQuery;
  onStale?: IIdentityFn;
}

interface ITimeRateableData { from?: OrNullable<number | string>; to?: OrNullable<number | string>; count?: OrNullable<number>; }
function timeRate(arg: OrNullable<ITimeRateableData>): OrNull<number> {
  if (ist.nullable(arg)) return null;
  const from = arg.from;
  const to = arg.to;
  if (!from || !to) return null;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (!isValidDate(fromDate) || !isValidDate(toDate)) return null;
  const diff = toDate.valueOf() - fromDate.valueOf();
  if (!diff) return null;
  if (!arg.count) return null;
  return (arg.count / msToDay(diff));
}


const JavaScriptPageContent = WithApi((props: IJavaScriptPageContentProps) => {
  const { queryData, onStale, api, me, } = props;
  const classes = useStyles();
  const colours = useRandomDashColours();

  const dashes: OrNull<INpmsDashboardDatasets[]> = useMemo(() => {
    const dashes: INpmsDashboardDatasets[] = queryData
      .npmsDashboards
      .nodes
      .filter(ist.notNullable)
      .map(dashNode => {
        type _unknown = '_unknown';
        const _unknown: _unknown = '_unknown';

        const dashName = dashNode.data.name ?? _unknown;
        const colours = shuffle(DashColours, { random: SeedRandom(dashName)  });
        const npmsPackages = dashNode
          .relations
          .items
          .nodes
          .map(itemNode => itemNode?.relations.npmsPackage)
          .filter(ist.notNullable)
        const packageNames = npmsPackages.map(packageNode => packageNode.data?.name ?? _unknown);

        const result: INpmsDashboardDatasets = {
          original: {
            id: dashNode.data.id,
            name: dashNode.data.name,
            packages: npmsPackages.map((packageNode): INpmsPackageSearchOption => ({
              id: packageNode.data.id,
              name: packageNode.data.name,
            })),
            source: dashNode,
          },
          graphical: {
            name: dashName,
            colours,
            can: {
              update: dashNode.can.update,
              softDelete: dashNode.can.softDelete,
              show: dashNode.can.show,
            },
            overview: {
              legend: { names: packageNames, colours },
              downloads: npmsPackages.map((packageNode): PieChartDatum => ({
                name: packageNode.data.name ?? _unknown,
                value: packageNode.data.data?.evaluation?.popularity?.downloadsCount ?? 0,
              })),
              growth: npmsPackages.map((packageNode): PieChartDatum => ({
                name: packageNode.data.name ?? _unknown,
                value: packageNode.data.data?.evaluation?.popularity?.downloadsAcceleration ?? 0,
              })),
              summary: {
                dimensions: packageNames,
                points: [{
                  name: 'popularity',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.score?.detail?.popularity)),
                }, {
                  name: 'quality',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.score?.detail?.quality)),
                }, {
                  name: 'maintenance',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.score?.detail?.maintenance)),
                }, {
                  name: 'total',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.score?.final)),
                }],
              },
              // 0 - 1 day
              // 1 - 1 week
              // 2 - 1 month
              // 3 - 3 month
              // 4 - 6 month
              // 5 - 12 month
              averageDailyDownloads: {
                dimensions: packageNames,
                points: [{
                  name: '1 Day',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.npm?.downloads?.[0]))),
                }, {
                  name: '1 Week',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.npm?.downloads?.[1]))),
                }, {
                  name: '1 Month',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.npm?.downloads?.[2]))),
                }, {
                  name: '3 Months',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.npm?.downloads?.[3]))),
                }, {
                  name: '6 Months',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.npm?.downloads?.[4]))),
                }, {
                  name: '12 Months',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.npm?.downloads?.[5]))),
                }].reverse(),
              },
              // 0 - 1 day
              // 1 - 1 week
              // 2 - 1 month
              // 3 - 3 month
              // 4 - 6 month
              // 5 - 12 month
              averageDailyCommits: {
                dimensions: packageNames,
                points: [{
                  name: '1 Week',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.github?.commits?.[0]))),
                }, {
                  name: '1 Month',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.github?.commits?.[1]))),
                }, {
                  name: '3 Months',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.github?.commits?.[2]))),
                }, {
                  name: '6 Months',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.github?.commits?.[3]))),
                }, {
                  name: '12 Months',
                  coordinates: npmsPackages.map((packageNode) => orNull(timeRate(packageNode.data.data?.collected?.github?.commits?.[4]))),
                }].reverse(),
              },
            },
            quality: {
              carefulness: {
                dimensions: packageNames,
                points: [{
                  name: 'carefulness',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.quality?.carefulness)),
                }],
              },
              tests: {
                dimensions: packageNames,
                points: [{
                  name: 'tests',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.quality?.tests)),
                }],
              },
              health: {
                dimensions: packageNames,
                points: [{
                  name: 'health',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.quality?.health)),
                }],
              },
              branding: {
                dimensions: packageNames,
                points: [{
                  name: 'branding',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.quality?.branding)),
                }],
              },
            },
            popularity: {
              communityInterest: {
                dimensions: packageNames,
                points: [{
                  name: 'community interest',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.popularity?.communityInterest)),
                }],
              },
              downloadCount: {
                dimensions: packageNames,
                points: [{
                  name: 'download count',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.popularity?.downloadsCount)),
                }],
              },
              downloadAcceleration: {
                dimensions: packageNames,
                points: [{
                  name: 'download acceleration',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.popularity?.downloadsAcceleration)),
                }],
              },
              dependentCount: {
                dimensions: packageNames,
                points: [{
                  name: 'dependent count',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.popularity?.dependentsCount)),
                }],
              },
            },
            maintenance: {
              releaseFrequency: {
                dimensions: packageNames,
                points: [{
                  name: 'release frequency',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.maintenance?.releasesFrequency)),
                }],
              },
              commitFrequency: {
                dimensions: packageNames,
                points: [{
                  name: 'commit frequency',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.maintenance?.commitsFrequency)),
                }],
              },
              openIssues: {
                dimensions: packageNames,
                points: [{
                  name: 'open issues',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.maintenance?.openIssues)),
                }],
              },
              issuesDistribution: {
                dimensions: packageNames,
                points: [{
                  name: 'issues distribution',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.evaluation?.maintenance?.issuesDistribution)),
                }],
              },
            },
            npm: {
              stars: {
                dimensions: packageNames,
                points: [{
                  name: 'stars',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.collected?.npm?.starsCount)),
                }],
              },
              dependents: {
                dimensions: packageNames,
                points: [{
                  name: 'dependents',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.collected?.npm?.dependentsCount)),
                }],
              },
            },
            github: {
              stars: {
                dimensions: packageNames,
                points: [{
                  name: 'stars',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.collected?.github?.starsCount)),
                }],
              },
              recentCommits: {
                dimensions: packageNames,
                points: [{
                  name: 'stars',
                  coordinates: npmsPackages.map((packageNode): number => {
                    let max = 0;
                    packageNode.data.data?.collected?.github?.commits?.forEach(commit => {
                      if (commit.count && (commit.count > max)) max = commit.count;
                    });
                    return max;
                  }),
                }],
              },
              openIssues: {
                dimensions: packageNames,
                points: [{
                  name: 'open issues',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.collected?.github?.issues?.openCount)),
                }],
              },
              closedIssues: {
                dimensions: packageNames,
                points: [{
                  name: 'closed issues',
                  coordinates: npmsPackages.map((packageNode) => {
                    const all = packageNode.data.data?.collected?.github?.issues?.count;
                    const open = packageNode.data.data?.collected?.github?.issues?.openCount;
                    if (ist.nullable(all) || ist.nullable(open)) return null;
                    return all - open;
                  }),
                }],
              },
              forks: {
                dimensions: packageNames,
                points: [{
                  name: 'forks',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.collected?.github?.forksCount)),
                }],
              },
              subscribers: {
                dimensions: packageNames,
                points: [{
                  name: 'subscribers',
                  coordinates: npmsPackages.map((packageNode) => orNull(packageNode.data.data?.collected?.github?.subscribersCount)),
                }],
              },
            },
          },
        };
        return result;
      });

    return dashes;
  }, [queryData]);

  const createDashboardDialog = useDialog(false);
  const sortDashboardsDialog = useDialog(false);
  const handleNpmsDashboardCreated = useCallback(() => flsx(createDashboardDialog.doClose, onStale)(), []);
  const handleNpmsDashboardSorted = useCallback(() => flsx(sortDashboardsDialog.doClose, onStale)(), []);

  const debugDialog = useDialog();

  return (
    <>
      <DebugJsonDialog title="Npm Stats" dialog={debugDialog} data={queryData} />
      <NpmsDashboardMutateForm dialog={createDashboardDialog} onSuccess={handleNpmsDashboardCreated} />
      <NpmsDashboardSortForm dialog={sortDashboardsDialog} onSuccess={handleNpmsDashboardSorted} />
      <Grid container spacing={2} className="text-center">
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Box pr={1}>
                <Typography className={clsx(classes.title, 'text-left')} component="h1" variant="h1">
                  Dashboards
                </Typography>
              </Box>
              <Box className={hidex(!me.can.npmsDashboards.create)} pr={1}>
                <IconButton color="primary" onClick={createDashboardDialog.doOpen}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Box className={hidex(!me.can.npmsDashboards.sort)} pr={1}>
                <IconButton color="primary" onClick={sortDashboardsDialog.doOpen}>
                  <SortIcon />
                </IconButton>
              </Box>
              <WhenDebugMode>
                <Box pr={1}>
                  <IconButton color="primary" onClick={debugDialog.doOpen}>
                    <BugReportIcon />
                  </IconButton>
                </Box>
              </WhenDebugMode>
            </Box>
            <Box pr={2} display="flex" justifyContent="flex-start" alignItems="center">
              <Typography color="textSecondary">
                data provided by&nbsp;
                <Box component="span">
                  <MUILink href="https://npms.io/">npms.io</MUILink>
                </Box>
              </Typography>
            </Box>
          </Box>
        </Grid>
        {(dashes ?? []).map(dashboard => (
          <Grid key={dashboard.original.id.toString()} item xs={12} sm={12}>
            <Paper className={classes.paper}>
              <NpmsDashboard
                key={dashboard.original.id.toString()}
                dashboard={dashboard}
                onChange={onStale}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
});


async function runPageDataQuery(
  api: Api,
  vars: JsPageDashboardQueryVariables,
): Promise<JsPageDashboardQuery> {
  const dashboards = await api.gql<JsPageDashboardQuery, JsPageDashboardQueryVariables>(
    jsPageDashboardQuery,
    vars,
  );
  return dashboards;
}

// export const getInitialProps  = async () => {
//   //
// }

// async function getProps(args: { cms: Cms; npmsApi: NpmsApi; api: Api; }): Promise<IJavaScriptPageProps> {
//   const { cms, npmsApi, api } = args

//   const dashboards = await attemptAsync(
//     runPageDataQuery(
//       api,
//       defaultQueryVars,
//     ),
//     normaliseApiException
//   );

//   return {
//     dashboards,
//   }
// }


// export const getStaticProps = staticPropsHandler<IJavaScriptPageProps>(async ({ ctx, cms, npmsApi, api, }) => {
//   const props = await getProps({ cms, npmsApi, api });
//   return {
//     props,
//     // revalidate: false,
//   };
// });


// export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
//   return {
//     fallback: false,
//     paths: [],
//   };
// });


export default JavaScriptPage;