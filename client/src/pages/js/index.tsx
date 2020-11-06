import React, {
  Fragment,
  MouseEventHandler,
  PureComponent,
  useCallback,
  useContext,
  useMemo,
  useState } from 'react';
import BugReportIcon from '@material-ui/icons/BugReport';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import Next, { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import SortIcon from '@material-ui/icons/Sort';
import { serverSidePropsHandler } from '../../helpers/server-side-props-handler.helper';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  makeStyles,
  Modal,
  Paper,
  Typography,
  withTheme } from '@material-ui/core';
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
import { Attempt, attemptAsync, isSuccess, } from '../../helpers/attempted.helper';
import { NormalisedError } from '../../helpers/normalise-error.helper';
import { NpmPackagesDashboard } from '../../components/npm-packages-dashboard/npm-packages-dashboard';
import { WithAttempted } from '../../components/with-attempted/with-attempted';
import { staticPathsHandler, staticPropsHandler } from '../../helpers/static-props-handler.helper';
import { Cms } from '../../cms/cms';
import { NpmsApi } from '../../npms-api/npms-api';
import { gql } from 'graphql-request';
import { Api } from '../../backend-api/api';
import { JsPageDashboardQuery, JsPageDashboardQueryVariables, JsPageDeleteDashboardMutation, JsPageDeleteDashboardMutationVariables } from '../../generated/graphql';
import { normaliseApiException, rethrow } from '../../backend-api/make-api-exception.helper';
import { pretty } from '../../helpers/pretty.helper';
import { FittedPieChart } from '../../components/fitted-pie-chart/fitted-pie-chart';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { OrNull } from '../../types/or-null.type';
import { Legend } from '../../components/legend/legend';
import { WithMemo } from '../../components/with-memo/with-memo';
import { PieChartDatum } from '../../types/pie-chart-datum.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import { shuffle } from '../../helpers/shuffle.helper';
import { DashColours } from '../../dashboard-theme';
import SeedRandom from 'seed-random';
import { FittedBarChart } from '../../components/fitted-bar-chart/fitted-bar-chart';
import { INpmsPackageSearchOption, NpmsPackageComboSearch } from '../../components/npms-package-combo-search/npms-package-combo-search';
import { MutateNpmsDashboardForm, IMutateNpmsDashboardFormOnSuccessFn } from '../../components/mutate-npms-dashboard/mutate-npms-dashboard.form';
import { ApiContext } from '../../contexts/api.context';
import { ist } from '../../helpers/ist.helper';
import { Id } from '../../types/id.type';
import { useUpdate } from '../../hooks/use-update.hook';
import { DebugModeContext } from '../../contexts/debug-mode.context';
import { INpmsDashboardDatasets, NpmsDashboard } from '../../components/npms-dashboard/npms-dashboard';
import { NpmsDashboardSortForm } from '../../components/npms-dashboard-sort/npms-dashboard-sort.form';
import { ApiException } from '../../backend-api/api.exception';

const jsPageDeleteDashboardQuery = gql`
mutation JsPageDeleteDashboard(
  $id:Int!
){
  deleteNpmsDashboard(
    dto:{
      id:$id
    }
  ){
    cursor,
    can{
      show
      update
      delete
    }
    data{
      id
      name
    }
  }
}
`;

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
    can{
      show
      create
    }
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
        delete
      }
      data{
        id
        name
      }
      relations{
        npmsPackages(
          query:{
            limit:$packageLimit
            offset:$packageOffset
          }
        ){
          can{
            show
            create
          }
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
              delete
            }
            data{
              id
              name
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
              last_ran_at
              created_at
              updated_at
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
  editModalContent: {
    width: '600px',
  },
  category: {
    //
  },
}));

const defaultQueryVars: JsPageDashboardQueryVariables = {
  dashboardLimit: 6,
  dashboardOffset: 0,
  packageLimit: 1000,
  packageOffset: 0,
}

function JavaScriptPage(props: IJavaScriptPageProps) {
  // do refresh...
  const { api, me } = useContext(ApiContext);

  const [dashboards, setDashboards] = useState<Attempt<JsPageDashboardQuery, ApiException>>(props.dashboards);

  const refreshDashboards = useCallback(async () => {
    const result = await runDashboardsQuery(api, defaultQueryVars);
    setDashboards(result);
  }, []);

  // refresh if user changes
  useUpdate(() => { refreshDashboards() }, [me?.id]);

  return (
    <JavaScriptPageContent
      {...props}
      dashboards={dashboards}
      refreshDashboards={refreshDashboards}
    />
  );
}

interface IJavaScriptPageContentProps {
  dashboards: Attempt<JsPageDashboardQuery, ApiException>;
  refreshDashboards: () => any;
}


function JavaScriptPageContent(props: IJavaScriptPageContentProps) {
  const {
    dashboards,
    refreshDashboards,
  } = props;
  const classes = useStyles();
  const { api, me } = useContext(ApiContext);
  const colours = useRandomDashColours();

  const dashes: OrNull<INpmsDashboardDatasets[]> = useMemo(() => {
    if (!isSuccess(dashboards)) { return null; }
    const dashes: INpmsDashboardDatasets[] = dashboards
      .value
      .npmsDashboards
      .nodes
      .filter(ist.notNullable)
      .map(dashNode => {
        type _unknown = '_unknown';
        const _unknown: _unknown = '_unknown';

        const dashName = dashNode.data.name ?? _unknown;
        const colours = shuffle(DashColours, { random: SeedRandom(dashName)  });
        const npmsPackages = dashNode.relations.npmsPackages.nodes.filter(ist.notNullable);
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
              delete: dashNode.can.delete,
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
  }, [dashboards]);

  const [createDashboardDialogIsOpen, setCreateDashboardDialogIsOpen] = useState<boolean>(false);
  const closeCreateDashboardDialog = useCallback(() => setCreateDashboardDialogIsOpen(false), []);
  const openCreateDashboardDialog = useCallback(() => setCreateDashboardDialogIsOpen(true), []);
  const handleNpmsDashboardCreated = useCallback(() => {
    setCreateDashboardDialogIsOpen(false);
    refreshDashboards();
  }, []);

  const [sortDashboardDialogIsOpen, setSortDashboardDialogIsOpen] = useState<boolean>(false);
  const closeSortDashboardDialog = useCallback(() => setSortDashboardDialogIsOpen(false), []);
  const openSortDashboardDialog = useCallback(() => setSortDashboardDialogIsOpen(true), []);
  const handleNpmsDashboardSorted = useCallback(() => {
    setSortDashboardDialogIsOpen(false);
    refreshDashboards();
  }, []);

  return (
    <>
      <Dialog open={createDashboardDialogIsOpen} onClose={closeCreateDashboardDialog}>
        <DialogTitle>
          Create Dashboard
        </DialogTitle>
        <DialogContent dividers>
          <MutateNpmsDashboardForm onSuccess={handleNpmsDashboardCreated} />
        </DialogContent>
      </Dialog>
      <Dialog open={sortDashboardDialogIsOpen} onClose={closeSortDashboardDialog}>
        <DialogTitle>
          Sort dashboards
        </DialogTitle>
        <DialogContent dividers>
          <NpmsDashboardSortForm onSuccess={handleNpmsDashboardSorted} />
        </DialogContent>
      </Dialog>
      <Grid container spacing={2} className="text-center">
        <Grid item xs={12}>
          <Typography className={clsx(classes.title, 'text-left')} component="h2" variant="h2">
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Box mr={2}>
                Dashboards
              </Box>
              <Box mr={2}>
                <Button variant="outlined" onClick={openCreateDashboardDialog}>
                  <AddIcon />
                </Button>
              </Box>
              <Box mr={2}>
                <Button variant="outlined" onClick={openSortDashboardDialog}>
                  <SortIcon />
                </Button>
              </Box>
            </Box>
          </Typography>
        </Grid>
        {(dashes ?? []).map(dashboard => (
          <Grid key={dashboard.original.id.toString()} item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <NpmsDashboard
                key={dashboard.original.id.toString()}
                dashboard={dashboard}
                onChange={refreshDashboards}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}


async function runDashboardsQuery(
  api: Api,
  vars: JsPageDashboardQueryVariables,
): Promise<Attempt<JsPageDashboardQuery, ApiException>> {
  const dashboards = await attemptAsync(api.connector.graphql<JsPageDashboardQuery, JsPageDashboardQueryVariables>(
    jsPageDashboardQuery,
    vars,
  ), normaliseApiException);

  return dashboards;
}

async function getProps(args: { cms: Cms; npmsApi: NpmsApi; api: Api; }): Promise<IJavaScriptPageProps> {
  const { cms, npmsApi, api } = args

  const dashboards = await runDashboardsQuery(
    api,
    defaultQueryVars,
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


export const getStaticPaths = staticPathsHandler(async ({ api, cms, npmsApi, publicEnv, }) => {
  return {
    fallback: false,
    paths: [],
  };
});


export default JavaScriptPage;