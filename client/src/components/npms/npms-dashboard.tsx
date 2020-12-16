// import * as remember from '../../custom.d.ts';
import ThumbDownIcon from '@material-ui/icons/ThumbDownOutlined';
import PublishIcon from '@material-ui/icons/PublishOutlined';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownOutlined';
import SendIcon from '@material-ui/icons/SendOutlined';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpOutlined';
import React, {
  useCallback,
  useState,
} from 'react';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/EditOutlined';
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { gql } from 'graphql-request';
import {
  SubmitNpmsDashboardMutation,
  SubmitNpmsDashboardMutationVariables,
  RejectNpmsDashboardMutation,
  RejectNpmsDashboardMutationVariables,
  PublishNpmsDashboardMutation,
  PublishNpmsDashboardMutationVariables,
  UnpublishNpmsDashboardMutation,
  UnpublishNpmsDashboardMutationVariables,
  SoftDeleteNpmsDashboardMutation,
  SoftDeleteNpmsDashboardMutationVariables,
} from '../../generated/graphql';
import { useRandomDashColours } from '../../hooks/use-random-dash-colors.hook';
import { Legend } from '../legend/legend';
import { PieChartDatum } from '../../types/pie-chart-datum.type';
import { MultiDimensionDataDefinition } from '../../types/multi-dimensional-data-definition.type';
import {
  NpmsDashboardMutateForm,
} from './npms-dashboard-mutate.form';
import { Id } from '../../types/id.type';
import { useDialog } from '../../hooks/use-dialog.hook';
import { FittedBarChart } from '../../components-charts/fitted-bar-chart/fitted-bar-chart';
import { FittedPieChart } from '../../components-charts/fitted-pie-chart/fitted-pie-chart';
import { DebugJsonDialog } from '../debug-json-dialog/debug-json-dialog';
import { FittedAreaChart } from '../../components-charts/fitted-area-chart/fitted-area-chart';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';
import { OrNull } from '../../types/or-null.type';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { useDebugMode } from '../../components-contexts/debug-mode.context';
import { hidex } from '../../helpers/hidden.helper';
import { useThemeColours } from '../../hooks/use-theme-colours.hook';

const submitNpmsDashboardMutation = gql`
mutation SubmitNpmsDashboard(
  $id:Int!
){
  submitNpmsDashboard(
    dto:{
      id:$id
    }
  ){
    data{
      id
      name
    }
  }
}
`;

const rejectNpmsDashboardMutation = gql`
mutation RejectNpmsDashboard(
  $id:Int!
){
  rejectNpmsDashboard(
    dto:{
      id:$id
    }
  ){
    data{
      id
      name
    }
  }
}
`;


const publishNpmsDashboardMutation = gql`
mutation PublishNpmsDashboard(
  $id:Int!
){
  publishNpmsDashboard(
    dto:{
      id:$id
    }
  ){
    data{
      id
      name
    }
  }
}
`;

const unpublishNpmsDashboardMutation = gql`
mutation UnpublishNpmsDashboard(
  $id:Int!
){
  unpublishNpmsDashboard(
    dto:{
      id:$id
    }
  ){
    data{
      id
      name
    }
  }
}
`;

const softDeleteNpmsDashboardMutation = gql`
mutation SoftDeleteNpmsDashboard(
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
    packages: string[];
    source?: unknown;
  };
  graphical: {
    name: string;
    colours: string[];
    ownedByMe: boolean;
    status: OrNull<{
      name: string;
      colour: string;
    }>;
    can: {
      show: boolean;
      update: boolean;
      softDelete: boolean;
      hardDelete: boolean;
      restore: boolean;
      submit: boolean;
      reject: boolean;
      publish: boolean;
      unpublish: boolean;
      createDashboardItems: boolean;
      hardDeleteDashboardItems: boolean;
    },
    overview: {
      legend: { names: string[]; colours: string[]; };
      downloads: PieChartDatum[];
      growth: PieChartDatum[];
      summary: MultiDimensionDataDefinition;
      // time chart...
      averageWeeklyDownloads: MultiDimensionDataDefinition,
      // time chart...
      averageDailyCommits: MultiDimensionDataDefinition,
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

export const NpmsDashboard = WithApi<INpmsDashboardProps>((props) => {
  const { dashboard, onChange, api, me } = props;
  const { enqueueSnackbar } = useSnackbar();
  const colours = useRandomDashColours();
  const themeColours = useThemeColours();

  /**
   * Menu
   */

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const handleMenuClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => { setMenuAnchor(evt.currentTarget); }, []);
  const handleMenuClose = useCallback(() => { setMenuAnchor(null); }, []);

  /**
   * ----------------
   * Submit
   * ----------------
   */

  const handleSubmitSuccess = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Submitted ${dashboard.original.name}`, { variant: 'success' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const handleSubmitError = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Failed to Submit ${dashboard.original.name}`, { variant: 'error' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const [doSubmit, submitState] = useMutation<SubmitNpmsDashboardMutation, IApiException>(
    async (): Promise<SubmitNpmsDashboardMutation> => {
      const vars: SubmitNpmsDashboardMutationVariables = { id: Number(dashboard.original.id) };
      const result = await api.gql<SubmitNpmsDashboardMutation, SubmitNpmsDashboardMutationVariables>(
        submitNpmsDashboardMutation,
        vars,
      );
      return result;
    },
    { onSuccess: handleSubmitSuccess, onError: handleSubmitError, }
  );

  /**
   * ----------------
   * Reject
   * ----------------
   */

  const handleRejectSuccess = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Rejected ${dashboard.original.name}`, { variant: 'success' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const handleRejectError = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Failed to Reject ${dashboard.original.name}`, { variant: 'error' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const [doReject, rejectState] = useMutation<RejectNpmsDashboardMutation, IApiException>(
    async (): Promise<RejectNpmsDashboardMutation> => {
      const vars: RejectNpmsDashboardMutationVariables = { id: Number(dashboard.original.id) };
      const result = await api.gql<RejectNpmsDashboardMutation, RejectNpmsDashboardMutationVariables>(
        rejectNpmsDashboardMutation,
        vars,
      );
      return result;
    },
    { onSuccess: handleRejectSuccess, onError: handleRejectError, }
  );

  /**
   * ----------------
   * Publish
   * ----------------
   */

  const handlePublishSuccess = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Published ${dashboard.original.name}`, { variant: 'success' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const handlePublishError = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Failed to Publish ${dashboard.original.name}`, { variant: 'error' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const [doPublish, publishState] = useMutation<PublishNpmsDashboardMutation, IApiException>(
    async (): Promise<PublishNpmsDashboardMutation> => {
      const vars: PublishNpmsDashboardMutationVariables = { id: Number(dashboard.original.id) };
      const result = await api.gql<PublishNpmsDashboardMutation, PublishNpmsDashboardMutationVariables>(
        publishNpmsDashboardMutation,
        vars,
      );
      return result;
    },
    { onSuccess: handlePublishSuccess, onError: handlePublishError, }
  );

  /**
   * ----------------
   * Unpublish
   * ----------------
   */

  const handleUnpublishSuccess = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Unpublished ${dashboard.original.name}`, { variant: 'success' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const handleUnpublishError = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Failed to unpublish ${dashboard.original.name}`, { variant: 'error' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const [doUnpublish, unpublishState] = useMutation<UnpublishNpmsDashboardMutation, IApiException>(
    async (): Promise<UnpublishNpmsDashboardMutation> => {
      const vars: UnpublishNpmsDashboardMutationVariables = { id: Number(dashboard.original.id) };
      const result = await api.gql<UnpublishNpmsDashboardMutation, UnpublishNpmsDashboardMutationVariables>(
        unpublishNpmsDashboardMutation,
        vars,
      );
      return result;
    },
    { onSuccess: handleUnpublishSuccess, onError: handleUnpublishError, }
  );

  /**
   * ----------------
   * SoftDelete
   * ----------------
   */

  const handleSoftDeleteSuccess = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Deleted ${dashboard.original.name}`, { variant: 'success' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const handleSoftDeleteError = useCallback(
    () => {
      handleMenuClose();
      enqueueSnackbar(`Failed to delete ${dashboard.original.name}`, { variant: 'error' });
      onChange?.();
    },
    [handleMenuClose, enqueueSnackbar, onChange],
  );
  const [doSoftDelete, softDeleteState] = useMutation<SoftDeleteNpmsDashboardMutation, IApiException>(
    async (): Promise<SoftDeleteNpmsDashboardMutation> => {
      const vars: SoftDeleteNpmsDashboardMutationVariables = { id: Number(dashboard.original.id) };
      const result = await api.gql<SoftDeleteNpmsDashboardMutation, SoftDeleteNpmsDashboardMutationVariables>(
        softDeleteNpmsDashboardMutation,
        vars,
      );
      return result;
    },
    { onSuccess: handleSoftDeleteSuccess, onError: handleSoftDeleteError, }
  );

  // --------


  const debugDialog = useDialog();
  const mutationDialog = useDialog();
  const handleNpmsDialogCreated = useCallback(() => {
    mutationDialog.doClose();
    onChange?.();
  }, []);


  const [showMore, setShowMore] = useState(false);
  const debugMode = useDebugMode();
  const isLoading =
    submitState.isLoading
    || rejectState.isLoading
    || publishState.isLoading
    || softDeleteState.isLoading;
  const isDisabled = isLoading;

  const canSubmit = dashboard.graphical.can.submit;
  const canReject = dashboard.graphical.can.reject;
  const canPublish = dashboard.graphical.can.publish;
  const canUnpublish = dashboard.graphical.can.unpublish;
  const hasExtraActions =
    canSubmit
    || canReject
    || canPublish
    || canUnpublish;

  const handleSubmitDashboardClicked = useCallback(() => doSubmit(), [doSubmit]);
  const handleRejectDashboardClicked = useCallback(() => doReject(), [doReject]);
  const handlePublishDashboardClicked = useCallback(() => doPublish(), [doPublish]);
  const handleUnpublishDashboardClicked = useCallback(() => doUnpublish(), [doUnpublish]);
  const handleSoftDeleteDashboardClicked = useCallback(() => doSoftDelete(), [doSoftDelete]);

  return (
    <>
      <NpmsDashboardMutateForm
        dialog={mutationDialog}
        hideItems={!(dashboard.graphical.can.createDashboardItems && dashboard.graphical.can.hardDeleteDashboardItems)}
        initial={{
          id: dashboard.original.id,
          name: dashboard.original.name,
          packages: dashboard.original.packages,
        }}
        onSuccess={handleNpmsDialogCreated}
      />
      {/* debug */}
      <DebugJsonDialog dialog={debugDialog} title={dashboard.original.name} data={dashboard} />
      <Grid className="text-center" container spacing={2}>
        <Grid item xs={12}>
          <Box position="relative" className="centered" mb={1}>
            <Typography className="centered" component="h2" variant="h2">
              {dashboard.graphical.name}
            </Typography>
            <Box width="100%" position="absolute" display="flex" justifyContent="space-between" alignItems="center" left={0}>
              <Box className="centered">
                {(dashboard.graphical.status && (hasExtraActions || dashboard.graphical.ownedByMe)) && (
                  <Box mr={1}>
                  <Typography className="capitalise" component="h4" variant="h4">
                    Status:&nbsp;
                    <span style={{ color: dashboard.graphical.status.colour }}>
                      {dashboard.graphical.status.name}
                    </span>
                  </Typography>
                  </Box>
                )}
              </Box>
              <Box className="centered">
                <Box className={hidex(!debugMode.isOn)} mr={1}>
                  <IconButton disabled={isDisabled} color="primary" onClick={debugDialog.doToggle}>
                    <BugReportIcon />
                  </IconButton>
                </Box>
                {dashboard.graphical.can.update && (
                  <Box>
                    <Box mr={1}>
                      <IconButton disabled={isDisabled} color="primary" onClick={mutationDialog.doOpen}>
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                {dashboard.graphical.can.softDelete && (
                  <Box>
                    <Box mr={1}>
                      <IconButton disabled={isDisabled} color="primary" onClick={handleSoftDeleteDashboardClicked}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                {hasExtraActions && (
                  <>
                    <Button
                      startIcon={!!menuAnchor ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                      variant="outlined"
                      color="primary"
                      onClick={handleMenuClick}
                    >
                      More Actions
                    </Button>
                    <Menu
                      anchorEl={menuAnchor}
                      onClose={handleMenuClose}
                      open={!!menuAnchor}
                      keepMounted
                    >
                      {canPublish && (
                        <MenuItem disabled={isDisabled} onClick={handlePublishDashboardClicked}>
                          <ListItemIcon className={themeColours.success}><PublishIcon /></ListItemIcon>
                          <ListItemText className={themeColours.success}>Publish</ListItemText>
                        </MenuItem>
                      )}
                      {canSubmit && (
                        <MenuItem onClick={handleSubmitDashboardClicked}>
                          <ListItemIcon className={themeColours.primary}><SendIcon /></ListItemIcon>
                          <ListItemText className={themeColours.primary}>Submit</ListItemText>
                        </MenuItem>
                      )}
                      {canReject && (
                        <MenuItem disabled={isDisabled} onClick={handleRejectDashboardClicked}>
                          <ListItemIcon className={themeColours.warning}><ThumbDownIcon /></ListItemIcon>
                          <ListItemText className={themeColours.warning}>Reject</ListItemText>
                        </MenuItem>
                      )}
                      {canUnpublish && (
                        <MenuItem disabled={isDisabled} onClick={handleUnpublishDashboardClicked}>
                          <ListItemIcon className={themeColours.error}><RemoveCircleOutlineIcon /></ListItemIcon>
                          <ListItemText className={themeColours.error}>Unpublish</ListItemText>
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid className="centered col" item xs={12} sm={4} md={2}>
          <Legend names={dashboard.graphical.overview.legend.names} colours={dashboard.graphical.colours} />
        </Grid>
        <Grid className="centered col" item xs={12} sm={4} md={2}>
          <Typography gutterBottom>Downloads</Typography>
          <FittedPieChart borderless colours={dashboard.graphical.colours} data={dashboard.graphical.overview.downloads} radius={50} />
        </Grid>
        <Grid className="centered col" item xs={12} sm={4} md={2}>
          <Typography gutterBottom>Growth</Typography>
          <FittedPieChart borderless colours={dashboard.graphical.colours} data={dashboard.graphical.overview.growth} radius={50} />
        </Grid>
        <Grid className="centered col" item xs={12} md={6}>
          <Typography gutterBottom>Summary</Typography>
          <FittedBarChart borderless height={110} colours={dashboard.graphical.colours} definition={dashboard.graphical.overview.summary} />
        </Grid>
        <Grid className="centered col" item xs={12} md={6}>
          <Typography gutterBottom>Average Weekly Downloads</Typography>
          <FittedAreaChart borderless height={160} colours={dashboard.graphical.colours} definition={dashboard.graphical.overview.averageWeeklyDownloads} />
        </Grid>
        <Grid className="centered col" item xs={12} md={6}>
          <Typography gutterBottom>Average Daily Commits</Typography>
          <FittedAreaChart borderless height={160} colours={dashboard.graphical.colours} definition={dashboard.graphical.overview.averageDailyCommits} />
        </Grid>
        <Grid className="centered col" item xs={12}>
          <Button variant="outlined" color="primary" onClick={() => setShowMore(prev => !prev)}>
            {showMore ? 'Show less' : 'Show more'}
          </Button>
        </Grid>
        {showMore && (
          <>
            <Grid className="text-center" item xs={12}>
              <Typography gutterBottom>Quality</Typography>
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.quality.carefulness} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.quality.tests} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.quality.health} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.quality.branding} />
            </Grid>

            <Grid className="text-center" item xs={12}>
              <Typography gutterBottom>Popularity</Typography>
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.popularity.communityInterest} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.popularity.downloadCount} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.popularity.downloadAcceleration} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.popularity.dependentCount} />
            </Grid>

            <Grid className="text-center" item xs={12}>
              <Typography gutterBottom>Maintenance</Typography>
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.maintenance.releaseFrequency} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.maintenance.commitFrequency} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.maintenance.openIssues} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.maintenance.issuesDistribution} />
            </Grid>

            <Grid className="text-center" item xs={12}>
              <Typography gutterBottom>GitHub</Typography>
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.stars} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.openIssues} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.closedIssues} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.forks} />
            </Grid>
            <Grid className="centered col" item xs={12} sm={6} md={3}>
              <FittedBarChart borderless height={100} colours={dashboard.graphical.colours} definition={dashboard.graphical.github.subscribers} />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
});
