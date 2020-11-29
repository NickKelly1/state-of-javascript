import React, {
  useCallback,
  useContext,
  useMemo,
  useState } from 'react';
import BugReportIcon from '@material-ui/icons/BugReport';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import SortIcon from '@material-ui/icons/Sort';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
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
  dashboards: Attempt<JsPageDashboardQuery, ApiException>;
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

function JavaScriptPage(props: IJavaScriptPageProps) {
  const { dashboards } = props;
  const { api, me } = useContext(ApiContext);

  const { data, isLoading, refetch, error, } = useQuery<JsPageDashboardQuery, ApiException>(
    [ JsPageDashboardQueryName, defaultQueryVars, me.hash ],
    async (): Promise<JsPageDashboardQuery> => {
      const result = await runPageDataQuery(api, defaultQueryVars);
      return result;
    },
    {
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
      {isLoading && (
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
}

interface IJavaScriptPageContentProps {
  queryData: JsPageDashboardQuery;
  onStale?: IIdentityFn;
}


function JavaScriptPageContent(props: IJavaScriptPageContentProps) {
  const { queryData, onStale, } = props;
  const classes = useStyles();
  const { api, me } = useContext(ApiContext);
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
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.score?.detail?.popularity ?? 0)),
                }, {
                  name: 'quality',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.score?.detail?.quality ?? 0)),
                }, {
                  name: 'maintenance',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.score?.detail?.maintenance ?? 0)),
                }, {
                  name: 'total',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.score?.final ?? 0)),
                }],
              }
            },
            quality: {
              carefulness: {
                dimensions: packageNames,
                points: [{
                  name: 'carefulness',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.quality?.carefulness ?? 0)),
                }],
              },
              tests: {
                dimensions: packageNames,
                points: [{
                  name: 'tests',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.quality?.tests ?? 0)),
                }],
              },
              health: {
                dimensions: packageNames,
                points: [{
                  name: 'health',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.quality?.health ?? 0)),
                }],
              },
              branding: {
                dimensions: packageNames,
                points: [{
                  name: 'branding',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.quality?.branding ?? 0)),
                }],
              },
            },
            popularity: {
              communityInterest: {
                dimensions: packageNames,
                points: [{
                  name: 'community interest',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.popularity?.communityInterest ?? 0)),
                }],
              },
              downloadCount: {
                dimensions: packageNames,
                points: [{
                  name: 'download count',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.popularity?.downloadsCount ?? 0)),
                }],
              },
              downloadAcceleration: {
                dimensions: packageNames,
                points: [{
                  name: 'download acceleration',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.popularity?.downloadsAcceleration ?? 0)),
                }],
              },
              dependentCount: {
                dimensions: packageNames,
                points: [{
                  name: 'dependent count',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.popularity?.dependentsCount ?? 0)),
                }],
              },
            },
            maintenance: {
              releaseFrequency: {
                dimensions: packageNames,
                points: [{
                  name: 'release frequency',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.maintenance?.releasesFrequency ?? 0)),
                }],
              },
              commitFrequency: {
                dimensions: packageNames,
                points: [{
                  name: 'commit frequency',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.maintenance?.commitsFrequency ?? 0)),
                }],
              },
              openIssues: {
                dimensions: packageNames,
                points: [{
                  name: 'open issues',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.maintenance?.openIssues ?? 0)),
                }],
              },
              issuesDistribution: {
                dimensions: packageNames,
                points: [{
                  name: 'issues distribution',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.evaluation?.maintenance?.issuesDistribution ?? 0)),
                }],
              },
            },
            npm: {
              stars: {
                dimensions: packageNames,
                points: [{
                  name: 'stars',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.collected?.npm?.starsCount ?? 0)),
                }],
              },
              dependents: {
                dimensions: packageNames,
                points: [{
                  name: 'dependents',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.collected?.npm?.dependentsCount ?? 0)),
                }],
              },
            },
            github: {
              stars: {
                dimensions: packageNames,
                points: [{
                  name: 'stars',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.collected?.github?.starsCount ?? 0)),
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
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.collected?.github?.issues?.openCount ?? 0)),
                }],
              },
              closedIssues: {
                dimensions: packageNames,
                points: [{
                  name: 'closed issues',
                  coordinates: npmsPackages.map((packageNode) => Math.max(
                    0,
                    (packageNode.data.data?.collected?.github?.issues?.count ?? 0) - (packageNode.data.data?.collected?.github?.issues?.openCount ?? 0),
                  )),
                }],
              },
              forks: {
                dimensions: packageNames,
                points: [{
                  name: 'forks',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.collected?.github?.forksCount ?? 0)),
                }],
              },
              subscribers: {
                dimensions: packageNames,
                points: [{
                  name: 'subscribers',
                  coordinates: npmsPackages.map((packageNode) => (packageNode.data.data?.collected?.github?.subscribersCount ?? 0)),
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
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box pr={1}>
              <Typography className={clsx(classes.title, 'text-left')} component="h1" variant="h1">
                Dashboards
              </Typography>
            </Box>
            <Box className={hidex(me.can.npmsDashboards.create)} pr={1}>
              <IconButton color="primary" onClick={createDashboardDialog.doOpen}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box className={hidex(me.can.npmsDashboards.sort)} pr={1}>
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
        </Grid>
        {(dashes ?? []).map(dashboard => (
          <Grid key={dashboard.original.id.toString()} item xs={12} sm={6}>
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
}


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

async function getProps(args: { cms: Cms; npmsApi: NpmsApi; api: Api; }): Promise<IJavaScriptPageProps> {
  const { cms, npmsApi, api } = args

  const dashboards = await attemptAsync(
    runPageDataQuery(
      api,
      defaultQueryVars,
    ),
    normaliseApiException
  );

  return {
    dashboards,
  }
}


export const getStaticProps = staticPropsHandler<IJavaScriptPageProps>(async ({ ctx, cms, npmsApi, api, }) => {
  const props = await getProps({ cms, npmsApi, api });
  return {
    props,
    // revalidate: false,
  };
});


// export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
//   return {
//     fallback: false,
//     paths: [],
//   };
// });


export default JavaScriptPage;