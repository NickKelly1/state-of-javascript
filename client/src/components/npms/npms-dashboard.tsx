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
  IconButton,
} from '@material-ui/core';
import { gql } from 'graphql-request';
import { NpmsDashboardSoftDeleteDashboardMutation, NpmsDashboardSoftDeleteDashboardMutationVariables } from '../../generated/graphql';
import { normaliseApiException, rethrow } from '../../backend-api/normalise-api-exception.helper';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { Legend } from '../legend/legend';
import { PieChartDatum } from '../../types/pie-chart-datum.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import { INpmsPackageSearchOption, } from './npms-package-combo-search';
import { NpmsDashboardMutateForm, } from './npms-dashboard-mutate.form';
import { ApiContext } from '../../components-contexts/api.context';
import { Id } from '../../types/id.type';
import { JsonPretty } from '../json-pretty/json-pretty';
import { JsonDownloadButton } from '../json-download-button/json-download-button';
import { WhenDebugMode } from '../../components-hoc/when-debug-mode/when-debug-mode';
import { useDialog } from '../../hooks/use-dialog.hook';
import { FittedBarChart } from '../../components-charts/fitted-bar-chart/fitted-bar-chart';
import { FittedPieChart } from '../../components-charts/fitted-pie-chart/fitted-pie-chart';
import { IWithDialogueProps } from '../../components-hoc/with-dialog/with-dialog';
import { DebugJsonDialog } from '../debug-json-dialog/debug-json-dialog';

const npmsDashboardSoftDeleteDashboardQuery = gql`
mutation NpmsDashboardSoftDeleteDashboard(
  $id:Int!
){
  softDeleteNpmsDashboard(
    dto:{
      id:$id
    }
  )
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
      softDelete: boolean,
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

export function NpmsDashboard(props: INpmsDashboardProps) {
  const { dashboard, onChange } = props;
  const { api, me } = useContext(ApiContext);
  const colours = useRandomDashColours();

  const handleSoftDeleteDashboard = useCallback(async () => {
    const vars: NpmsDashboardSoftDeleteDashboardMutationVariables = { id: Number(dashboard.original.id) };
    const result = await api
      .connector
      .graphql<NpmsDashboardSoftDeleteDashboardMutation, NpmsDashboardSoftDeleteDashboardMutationVariables>(
        npmsDashboardSoftDeleteDashboardQuery,
        vars,
      )
      .catch(rethrow(normaliseApiException));

    onChange?.();
  }, [dashboard.original.id]);

  const debugDialog = useDialog();
  const mutationDialog = useDialog();
  const handleNpmsDialogCreated = useCallback(() => {
    mutationDialog.doClose();
    onChange?.();
  }, []);

  const [showMore, setShowMore] = useState(false);


  return (
    <>
      <NpmsDashboardMutateForm
        dialog={mutationDialog}
        initial={{
          id: dashboard.original.id,
          name: dashboard.original.name,
          packages: dashboard.original.packages,
        }}
        onSuccess={handleNpmsDialogCreated}
      />
      {/* debug */}
      <DebugJsonDialog dialog={debugDialog} title={dashboard.original.name} data={dashboard.original} />
      <Grid className="text-center" container spacing={2}>
        <Grid item xs={12}>
          <Typography className="centered" component="h2" variant="h2">
            {dashboard.graphical.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <WhenDebugMode>
              <Box px={1}>
                <IconButton color="primary" onClick={debugDialog.doToggle}>
                  <BugReportIcon />
                </IconButton>
              </Box>
            </WhenDebugMode>
            {dashboard.graphical.can.update && (
              <Box px={1}>
                <IconButton color="primary" onClick={mutationDialog.doOpen}>
                  <EditIcon />
                </IconButton>
              </Box>
            )}
            {dashboard.graphical.can.softDelete && (
              <Box px={1}>
                <IconButton color="primary" onClick={handleSoftDeleteDashboard}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid className="centered col" item xs={12} sm={4}>
          <Legend names={dashboard.graphical.overview.legend.names} colours={dashboard.graphical.colours} />
        </Grid>
        <Grid className="centered col" item xs={12} sm={4}>
          <Box mb={1}>
            <Typography>
              Downloads
            </Typography>
          </Box>
          <FittedPieChart borderless colours={dashboard.graphical.colours} data={dashboard.graphical.overview.downloads} radius={50} />
        </Grid>
        <Grid className="centered col" item xs={12} sm={4}>
          <Box mb={1}>
            <Typography>
              Growth
            </Typography>
          </Box>
          <FittedPieChart borderless colours={dashboard.graphical.colours} data={dashboard.graphical.overview.growth} radius={50} />
        </Grid>
        <Grid className="centered col" item xs={12}>
          <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.overview.summary} />
        </Grid>

        <Grid className="centered col" item xs={12}>
          <Button variant="outlined" color="primary" onClick={() => setShowMore(prev => !prev)}>
            {showMore ? 'Show less' : 'Show more'}
          </Button>
        </Grid>
        {showMore && (
          <>
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
          </>
        )}
      </Grid>
    </>
  );
}
