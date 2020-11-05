// import * as remember from '../../custom.d.ts';
import React, { useCallback, useContext, useState } from 'react';
import BugReportIcon from '@material-ui/icons/BugReport';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Box,
  Button,
  Grid,
  Link,
  makeStyles,
  Modal,
  Paper,
  Typography,
  withTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { gql } from 'graphql-request';
import { Api } from '../../backend-api/api';
import { JsPageDashboardQuery, JsPageDashboardQueryVariables, JsPageDeleteDashboardMutation, JsPageDeleteDashboardMutationVariables } from '../../generated/graphql';
import { normaliseApiException, rethrow } from '../../backend-api/make-api-exception.helper';
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { pretty } from '../../helpers/pretty.helper';
import { FittedPieChart } from '../../components/fitted-pie-chart/fitted-pie-chart';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { Legend } from '../../components/legend/legend';
import { PieChartDatum } from '../../types/pie-chart-datum.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import { FittedBarChart } from '../../components/fitted-bar-chart/fitted-bar-chart';
import { INpmsPackageSearchOption, } from '../../components/npms-package-combo-search/npms-package-combo-search';
import { MutateNpmsDashboardForm, } from '../../components/mutate-npms-dashboard/mutate-npms-dashboard.form';
import { ApiContext } from '../../contexts/api.context';
import { Id } from '../../types/id.type';
import { DebugModeContext } from '../../contexts/debug-mode.context';
import { JsonPretty } from '../json-pretty/json-pretty';
import { JsonDownloadButton } from '../json-download-button/json-download-button';

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

export interface INpmsDashboardDatasets {
  original: {
    id: Id;
    name: string;
    packages: INpmsPackageSearchOption[];
    source?: unknown;
  };
  graphical: {
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
}

interface INpmsDashboardProps {
  dashboard: INpmsDashboardDatasets;
  onChange?: () => any;
}

const useStyles = makeStyles((theme) => ({
  //
}));

export function NpmsDashboard(props: INpmsDashboardProps) {
  const { dashboard, onChange } = props;
  const classes = useStyles();
  const { api, me } = useContext(ApiContext);
  const colours = useRandomDashColours();

  type IMutationDialogState = | { isOpen: false; } | { isOpen: true; };
  const [mutationDialogState, setMutationDialogState] = useState<IMutationDialogState>({ isOpen: false, });
  const closeMutationDialog = useCallback(() => setMutationDialogState({ isOpen: false, }), []);
  const openMutationDialog = useCallback(() => setMutationDialogState({ isOpen: true }), []);
  const handleNpmsDialogCreated = useCallback(() => {
    setMutationDialogState({ isOpen: false, });
    onChange?.();
  }, []);

  type IDebugDialogState = | { isOpen: false; } | { isOpen: true; };
  const [debugDialogState, setDebugDialogState] = useState<IDebugDialogState>({ isOpen: false, });
  const closeDebugDialog = useCallback(() => setDebugDialogState({ isOpen: false, }), []);
  const openDebugDialog = useCallback(() => setDebugDialogState({ isOpen: true }), []);

  const handleDeleteDashboard = useCallback(async () => {
    const vars: JsPageDeleteDashboardMutationVariables = { id: Number(dashboard.original.id) };
    const result = await api
      .connector
      .graphql<JsPageDeleteDashboardMutation, JsPageDeleteDashboardMutationVariables>(
        jsPageDeleteDashboardQuery,
        vars,
      )
      .catch(rethrow(normaliseApiException));

    onChange?.();
  }, [dashboard.original.id]);

  const debugMode = useContext(DebugModeContext);

  return (
    <>

    {/* edit */}
      <Dialog open={mutationDialogState.isOpen} onClose={closeMutationDialog}>
        <DialogTitle>
          Edit Dashboard
        </DialogTitle>
        <DialogContent>
          <MutateNpmsDashboardForm
            initial={{
              id: dashboard.original.id,
              name: dashboard.original.name,
              packages: dashboard.original.packages,
            }}
            onSuccess={handleNpmsDialogCreated}
          />
        </DialogContent>
      </Dialog>

      {/* debug */}
      <Dialog open={debugDialogState.isOpen} onClose={closeDebugDialog} maxWidth="xl">
        <DialogTitle>
          {`Debug information (${dashboard.original.name})`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box mx={3} p={3} display="flex" justifyContent="flex-start" alignItems="flex-start" flexDirection="column">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography component="h2">
                    Data
                  </Typography>
                  <Box ml={2}>
                    <JsonDownloadButton name={`dashboard-${dashboard.original.name}-data`} src={dashboard.original} />
                  </Box>
                </Box>
                <JsonPretty src={dashboard.original} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mx={3} p={3} display="flex" justifyContent="flex-start" alignItems="flex-start" flexDirection="column">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography component="h2">
                    Visual
                  </Typography>
                  <Box ml={2}>
                    <JsonDownloadButton name={`dashboard-${dashboard.original.name}-visual`} src={dashboard.original} />
                  </Box>
                </Box>
                <JsonPretty src={dashboard.graphical} />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Grid className="text-center" container spacing={2}>
        <Grid container item xs={12}>
          <Grid item xs={6} sm={4}>
            {debugMode.isOn && (
              <Box component="span">
                <Button onClick={openDebugDialog}>
                  <BugReportIcon />
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography className="centered" component="h2" variant="h2">
              {dashboard.graphical.name}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            {dashboard.graphical.can.update && (
              <Box component="span">
                <Button onClick={openMutationDialog}>
                  <EditIcon />
                </Button>
              </Box>
            )}
            {dashboard.graphical.can.delete && (
              <Box component="span">
                <Button onClick={handleDeleteDashboard}>
                  <DeleteIcon />
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        <Grid className="centered col" item xs={12} sm={4}>
          <Legend names={dashboard.graphical.overview.legend.names} colours={dashboard.graphical.colours} />
        </Grid>
        <Grid className="centered col" item xs={12} sm={4}>
          <Typography>
            Downloads
          </Typography>
          <FittedPieChart borderless colours={dashboard.graphical.colours} data={dashboard.graphical.overview.downloads} radius={50} />
        </Grid>
        <Grid className="centered col" item xs={12} sm={4}>
          <Typography>
            Growth
          </Typography>
          <FittedPieChart borderless colours={dashboard.graphical.colours} data={dashboard.graphical.overview.growth} radius={50} />
        </Grid>
        <Grid className="centered col" item xs={12}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.overview.summary} />
        </Grid>

        <Grid className="text-left" item xs={12}>
          <Typography>
            Quality
          </Typography>
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.quality.carefulness} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.quality.tests} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.quality.health} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.quality.branding} />
        </Grid>

        <Grid className="text-left" item xs={12}>
          <Typography>
            Popularity
          </Typography>
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.popularity.communityInterest} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.popularity.downloadCount} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.popularity.downloadAcceleration} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.popularity.dependentCount} />
        </Grid>

        <Grid className="text-left" item xs={12}>
          <Typography>
            Maintenance
          </Typography>
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.maintenance.releaseFrequency} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.maintenance.commitFrequency} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.maintenance.openIssues} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.maintenance.issuesDistribution} />
        </Grid>

        <Grid className="text-left" item xs={12}>
          <Typography>
            GitHub
          </Typography>
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.stars} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.openIssues} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.closedIssues} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.forks} />
        </Grid>
        <Grid className="centered col" item xs={6}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.subscribers} />
        </Grid>
      </Grid>
    </>
  );
}
