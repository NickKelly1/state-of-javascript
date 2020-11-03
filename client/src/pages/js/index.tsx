import React, { Fragment, MouseEventHandler, PureComponent, useCallback, useContext, useMemo, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import Next, { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { serverSidePropsHandler } from '../../helpers/server-side-props-handler.helper';
import { Box, Button, Grid, Link, makeStyles, Modal, Paper, Typography, withTheme } from '@material-ui/core';
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
import { JsPageDashboardQuery, JsPageDashboardQueryVariables } from '../../generated/graphql';
import { normaliseApiException } from '../../backend-api/make-api-exception.helper';
import { IApiException } from '../../backend-api/types/api.exception.interface';
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
import { NpmsPackageComboSearch } from '../../components/npms-package-combo-search/npms-package-combo-search';
import { CreateNpmsDashboardForm, ICreateNpmsDashboardFormOnSuccessFn } from '../../components/create-npms-dashboard/create-npms-dashboard.form';
import { ApiContext } from '../../contexts/api.context';
import { ist } from '../../helpers/ist.helper';

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
                    releaseFrequency
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
  dashboards: Attempt<JsPageDashboardQuery, IApiException>;
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
    // border: '1px white solid',
    // borderRadius: '16px'
  },
}));

const defaultQueryVars: JsPageDashboardQueryVariables = {
  dashboardLimit: 2,
  dashboardOffset: 0,
  packageLimit: 1000,
  packageOffset: 0,
}

function JavaScriptPage(props: IJavaScriptPageProps) {
  // do refresh...
  const { api } = useContext(ApiContext);

  const [dashboards, setDashboards] = useState<Attempt<JsPageDashboardQuery, IApiException>>(props.dashboards);

  const refreshDashboards = useCallback(async () => {
    const result = await runDashboardsQuery(api, defaultQueryVars);
    setDashboards(result);
  }, []);

  return (
    <JavaScriptPageContent
      {...props}
      dashboards={dashboards}
      refreshDashboards={refreshDashboards}
    />
  );
}

interface IJavaScriptPageContentProps {
  dashboards: Attempt<JsPageDashboardQuery, IApiException>;
  refreshDashboards: () => any;
}


function JavaScriptPageContent(props: IJavaScriptPageContentProps) {
  const {
    dashboards,
    refreshDashboards,
  } = props;
  const classes = useStyles();

  const colours = useRandomDashColours();

  interface IDash {
    name: string;
    colours: string[];
    can: {
      show: boolean,
      update: boolean,
      delete: boolean,
    },
    overview: {
      legend: { names: string[]; colours: string[]; };
      downloads: PieChartDatum[];
      growth: PieChartDatum[];
      summary: MultiDimensionDataDefinition;
    };
    quality: {
      carefulness: MultiDimensionDataDefinition;
      tests: MultiDimensionDataDefinition;
      health: MultiDimensionDataDefinition;
      branding: MultiDimensionDataDefinition;
    };
    popularity: {
      communityInterest: MultiDimensionDataDefinition;
      downloadCount: MultiDimensionDataDefinition;
      downloadAcceleration: MultiDimensionDataDefinition;
      dependentCount: MultiDimensionDataDefinition;
    };
    maintenance: {
      releaseFrequency: MultiDimensionDataDefinition;
      commitFrequency: MultiDimensionDataDefinition;
      openIssues: MultiDimensionDataDefinition;
      issuesDistribution: MultiDimensionDataDefinition;
    };
    npm: {
      stars: MultiDimensionDataDefinition;
      dependents: MultiDimensionDataDefinition;
    };
    github: {
      stars: MultiDimensionDataDefinition;
      recentCommits: MultiDimensionDataDefinition;
      openIssues: MultiDimensionDataDefinition;
      closedIssues: MultiDimensionDataDefinition;
      forks: MultiDimensionDataDefinition;
      subscribers: MultiDimensionDataDefinition;
    };
  }

  const dashes: OrNull<IDash[]> = useMemo(() => {
    if (!isSuccess(dashboards)) { return null; }
    const dashes: IDash[] = dashboards
      .value
      .npmsDashboards
      .nodes
      .filter(ist.notNullable)
      .map(dashNode => {
        type _unknown = '_unknown';
        const _unknown: _unknown = '_unknown';

        const dashName = dashNode.data.name ?? _unknown;
        const colours = shuffle(DashColours, { random: SeedRandom(dashName)  });
        const packageNames = dashNode.relations.npmsPackages.nodes.map(packageNode => packageNode?.data?.name ?? _unknown);

        const result: IDash = {
          name: dashName,
          colours,
          can: {
            update: dashNode.can.update,
            delete: dashNode.can.delete,
            show: dashNode.can.show,
          },
          overview: {
            legend: { names: packageNames, colours },
            downloads: dashNode.relations.npmsPackages.nodes.map((packageNode): PieChartDatum => ({
              name: packageNode?.data.name ?? _unknown,
              value: packageNode?.data.data?.evaluation?.popularity?.downloadsCount ?? 0,
            })),
            growth: dashNode.relations.npmsPackages.nodes.map((packageNode): PieChartDatum => ({
              name: packageNode?.data.name ?? _unknown,
              value: packageNode?.data.data?.evaluation?.popularity?.downloadsAcceleration ?? 0,
            })),
            summary: {
              dimensions: packageNames,
              points: [{
                name: 'popularity',
                coordinates: dashNode.relations.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.score?.detail?.popularity ?? 0)),
              }, {
                name: 'quality',
                coordinates: dashNode.relations.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.score?.detail?.quality ?? 0)),
              }, {
                name: 'maintenance',
                coordinates: dashNode.relations.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.score?.detail?.maintenance ?? 0)),
              }, {
                name: 'total',
                coordinates: dashNode.relations.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.score?.final ?? 0)),
              }],
            }
          },
          quality: {
            carefulness: {
              dimensions: packageNames,
              points: [{
                name: 'carefulness',
                coordinates: dashNode.relations.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.quality?.carefulness ?? 0)),
              }],
            },
            tests: {
              dimensions: packageNames,
              points: [{
                name: 'tests',
                coordinates: dashNode.relations.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.quality?.tests ?? 0)),
              }],
            },
            health: {
              dimensions: packageNames,
              points: [{
                name: 'health',
                coordinates: dashNode.relations.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.quality?.health ?? 0)),
              }],
            },
            branding: {
              dimensions: packageNames,
              points: [{
                name: 'branding',
                coordinates: dashNode.relations.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.quality?.branding ?? 0)),
              }],
            },
          },
          popularity: {
            communityInterest: {
              dimensions: packageNames,
              points: [{
                name: 'community interest',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.popularity?.communityInterest ?? 0)),
              }],
            },
            downloadCount: {
              dimensions: packageNames,
              points: [{
                name: 'download count',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.popularity?.downloadsCount ?? 0)),
              }],
            },
            downloadAcceleration: {
              dimensions: packageNames,
              points: [{
                name: 'download acceleration',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.popularity?.downloadsAcceleration ?? 0)),
              }],
            },
            dependentCount: {
              dimensions: packageNames,
              points: [{
                name: 'dependent count',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.popularity?.dependentsCount ?? 0)),
              }],
            },
          },
          maintenance: {
            releaseFrequency: {
              dimensions: packageNames,
              points: [{
                name: 'release frequency',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.maintenance?.releaseFrequency ?? 0)),
              }],
            },
            commitFrequency: {
              dimensions: packageNames,
              points: [{
                name: 'commit frequency',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.maintenance?.commitsFrequency ?? 0)),
              }],
            },
            openIssues: {
              dimensions: packageNames,
              points: [{
                name: 'open issues',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.maintenance?.openIssues ?? 0)),
              }],
            },
            issuesDistribution: {
              dimensions: packageNames,
              points: [{
                name: 'issues distribution',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.evaluation?.maintenance?.issuesDistribution ?? 0)),
              }],
            },
          },
          npm: {
            stars: {
              dimensions: packageNames,
              points: [{
                name: 'stars',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.collected?.npm?.starsCount ?? 0)),
              }],
            },
            dependents: {
              dimensions: packageNames,
              points: [{
                name: 'dependents',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.collected?.npm?.dependentsCount ?? 0)),
              }],
            },
          },
          github: {
            stars: {
              dimensions: packageNames,
              points: [{
                name: 'stars',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.collected?.github?.starsCount ?? 0)),
              }],
            },
            recentCommits: {
              dimensions: packageNames,
              points: [{
                name: 'stars',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode): number => {
                  let max = 0;
                  packageNode?.data.data?.collected?.github?.commits?.forEach(commit => {
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
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.collected?.github?.issues?.openCount ?? 0)),
              }],
            },
            closedIssues: {
              dimensions: packageNames,
              points: [{
                name: 'closed issues',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => Math.max(
                  0,
                  (packageNode?.data.data?.collected?.github?.issues?.count ?? 0) - (packageNode?.data.data?.collected?.github?.issues?.openCount ?? 0),
                )),
              }],
            },
            forks: {
              dimensions: packageNames,
              points: [{
                name: 'forks',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.collected?.github?.forksCount ?? 0)),
              }],
            },
            subscribers: {
              dimensions: packageNames,
              points: [{
                name: 'subscribers',
                coordinates: dashNode.relations?.npmsPackages.nodes.map((packageNode) => (packageNode?.data.data?.collected?.github?.subscribersCount ?? 0)),
              }],
            },
          },
        };
        return result;
      });

    return dashes;
  }, [dashboards]);

  const [createDashboardModalOpen, setCreateDashboardModalOpen] = useState(false);
  const handleCreateDashboardModalClosed = useCallback(() => setCreateDashboardModalOpen(false), []);
  const handleCreateDashboardClicked = useCallback(() => setCreateDashboardModalOpen(true), []);
  const handleNpmsDashboardCreated: ICreateNpmsDashboardFormOnSuccessFn = useCallback(() => {
    setCreateDashboardModalOpen(false);
    refreshDashboards();
  }, []);

  const [editDashboardModalOpen, setEditDashboardModalOpen] = useState(false);
  const handleEditDashboardModalClosed = useCallback(() => { setEditDashboardModalOpen(false); }, []);
  const handleEditDashboardClicked = useCallback(() => setCreateDashboardModalOpen(true), []);
  const handleNpmsDashboardEdited: ICreateNpmsDashboardFormOnSuccessFn = useCallback(() => {
    setEditDashboardModalOpen(false);
    refreshDashboards();
  }, []);

  function handleEditDash() {
    //
  }

  return (
    <>
      <Modal
        open={createDashboardModalOpen}
        onClose={handleCreateDashboardModalClosed}
        className="modal"
        aria-labelledby="mutate-dashboard"
        aria-describedby="mutate-dashboard"
      >
        <Paper className={clsx('modal-content', classes.paper, classes.editModalContent)}>
          <CreateNpmsDashboardForm onSuccess={handleNpmsDashboardCreated} />
        </Paper>
      </Modal>
      <Grid container spacing={2} className="text-center">
        <Grid item xs={12}>
          <Typography className={clsx(classes.title, 'text-left')} component="h2" variant="h2">
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Box mr={2}>
                Dashboards
              </Box>
              <Button variant="outlined" onClick={handleCreateDashboardClicked}>
                <AddIcon />
              </Button>
            </Box>
          </Typography>
        </Grid>
        {(dashes ?? []).map(dash => (
          <Grid item xs={12} sm={6} key={dash.name}>
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid container item xs={12}>
                  <Grid item xs={12} sm={4} />
                  <Grid item xs={6} sm={4}>
                    <Typography className="centered" component="h2" variant="h2">
                      {dash.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    {dash.can.update && (
                      <Box component="span">
                        <Button>
                          <EditIcon />
                        </Button>
                      </Box>
                    )}
                    {dash.can.delete && (
                      <Box component="span">
                        <Button>
                          <DeleteIcon />
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
                <Grid className="centered col" item xs={12} sm={4}>
                  <Legend names={dash.overview.legend.names} colours={dash.colours} />
                </Grid>
                <Grid className="centered col" item xs={12} sm={4}>
                  <Typography>
                    Downloads
                  </Typography>
                  <FittedPieChart borderless filled colours={dash.colours} data={dash.overview.downloads} radius={50} />
                </Grid>
                <Grid className="centered col" item xs={12} sm={4}>
                  <Typography>
                    Growth
                  </Typography>
                  <FittedPieChart borderless filled colours={dash.colours} data={dash.overview.growth} radius={50} />
                </Grid>
                <Grid className="centered col" item xs={12}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.overview.summary} />
                </Grid>

                <Grid className="text-left" item xs={12}>
                  <Typography>
                    Quality
                  </Typography>
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.quality.carefulness} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.quality.tests} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.quality.health} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.quality.branding} />
                </Grid>

                <Grid className="text-left" item xs={12}>
                  <Typography>
                    Popularity
                  </Typography>
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.popularity.communityInterest} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.popularity.downloadCount} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.popularity.downloadAcceleration} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.popularity.dependentCount} />
                </Grid>

                <Grid className="text-left" item xs={12}>
                  <Typography>
                    Maintenance
                  </Typography>
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.maintenance.releaseFrequency} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.maintenance.commitFrequency} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.maintenance.openIssues} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.maintenance.issuesDistribution} />
                </Grid>


                <Grid className="text-left" item xs={12}>
                  <Typography>
                    GitHub
                  </Typography>
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.github.stars} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.github.openIssues} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.github.closedIssues} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.github.forks} />
                </Grid>
                <Grid className="centered col" item xs={6}>
                  <FittedBarChart borderless height={100} colours={dash.colours} definition={dash.github.subscribers} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <div>
        <pre>
          {pretty(dashes)}
        </pre>
      </div>
    </>
  );
}


async function runDashboardsQuery(
  api: Api,
  vars: JsPageDashboardQueryVariables,
): Promise<Attempt<JsPageDashboardQuery, IApiException>> {
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