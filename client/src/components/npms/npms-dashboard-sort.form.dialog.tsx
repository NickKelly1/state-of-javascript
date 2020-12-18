import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/Restore';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import { gql } from 'graphql-request';
import React, {
  useCallback,
  useState,
} from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { useMutation, useQuery } from 'react-query';
import { ApiException } from '../../backend-api/api.exception';
import {
  NpmsDashbortSortFormQuery,
  NpmsDashbortSortFormQueryVariables,
  NpmsDashbortSortFormSubmitMutation,
  NpmsDashbortSortFormSubmitMutationVariables,
} from '../../generated/graphql';
import { ist } from '../../helpers/ist.helper';
import { useUpdate } from '../../hooks/use-update.hook';
import { Id } from '../../types/id.type';
import { ExceptionDetail } from '../exception/exception-detail';
import { WhenDebugMode } from '../../components-hoc/when-debug-mode/when-debug-mode';
import { WithRandomId } from '../../components-hoc/with-random-id/with-random-id';
import { IWithDialogueProps, WithDialogue } from '../../components-hoc/with-dialog/with-dialog';
import { useSubmitForm } from '../../hooks/use-submit-form.hook';
import { useDialog } from '../../hooks/use-dialog.hook';
import { JsonDialog } from '../debug-json-dialog/json-dialog';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';
import { WithLoadable } from '../../components-hoc/with-loadable/with-loadable';
import { ExceptionButton } from '../exception-button/exception-button.helper';

const NpmsDashbortSortFormQueryName = 'NpmsDashbortSortFormQuery';
const npmsDashboardSortFormQuery = gql`
query NpmsDashbortSortForm(
  $dashboardOffset:Int!
  $dashboardLimit:Int!
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
        softDelete
        hardDelete
      }
      data{
        id
        name
        created_at
        updated_at
        deleted_at
      }
    }
  }
}
`

const npmsDashbortSortFormMutation = gql`
mutation NpmsDashbortSortFormSubmit(
  $dashboard_ids:[Int!]!
){
  sortNpmsDashboards(
    dto:{
      dashboard_ids:$dashboard_ids
    }
  )
}
`

export interface INpmsDashboardSortFormPropsOnSuccessFn { (): any; }
export interface INpmsDashboardSortFormProps extends IWithDialogueProps {
  onSuccess?: INpmsDashboardSortFormPropsOnSuccessFn;
}

const defaultQueryVars: NpmsDashbortSortFormQueryVariables = {
  dashboardLimit: 1000,
  dashboardOffset: 0,
}


export const NpmsDashboardSortForm = WithDialogue<INpmsDashboardSortFormProps>({ fullWidth: true })(WithApi((props) => {
  const { onSuccess, dialog, api, me, } = props;

  const [vars, setVars] = useState<NpmsDashbortSortFormQueryVariables>({
    dashboardLimit: defaultQueryVars.dashboardLimit,
    dashboardOffset: defaultQueryVars.dashboardOffset,
  });

  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery<NpmsDashbortSortFormQuery, ApiException>(
    [NpmsDashbortSortFormQueryName, vars, me.hash],
    async (): Promise<NpmsDashbortSortFormQuery> => {
      const result = await api.gql<NpmsDashbortSortFormQuery, NpmsDashbortSortFormQueryVariables>(
        npmsDashboardSortFormQuery,
        vars,
      );
      return result;
    },
  );

  return (
    <>
      <DialogTitle>
        Sort Dashboards
      </DialogTitle>
      <WithLoadable
        data={data}
        isLoading={isLoading}
        error={error}
        renderLoading={() => (
          <DialogContent className="centered col">
            <CircularProgress />
          </DialogContent>
        )}
        renderError={(error) => (
          <DialogContent className="centered col">
            <ExceptionButton exception={error} />
          </DialogContent>
        )}
      >
        {(data) => (
          <NpmsDashboardSortFormContent
            dialog={dialog}
            onSuccess={onSuccess}
            source={data}
          />
        )}
      </WithLoadable>
    </>
  );
}));


interface INpmsDashboardSortFormContentProps extends IWithDialogueProps {
  source: NpmsDashbortSortFormQuery;
  onSuccess?: INpmsDashboardSortFormPropsOnSuccessFn;
}

interface INpmsDashboardSortFormStateDashboard { id: Id; name: string; }
type INpmsDashboardSortFormState = { dashboards: INpmsDashboardSortFormStateDashboard[] };

function npmsDashboardSortFormQueryToFormState(input: NpmsDashbortSortFormQuery): INpmsDashboardSortFormState {
  const dashboards: INpmsDashboardSortFormStateDashboard[] =  input
    .npmsDashboards
    .nodes
    .filter(ist.notNullable)
    .map(node => ({ id: node.data.id, name: node.data.name }));
  const state: INpmsDashboardSortFormState = { dashboards };
  return state;
}

const NpmsDashboardSortFormContent = WithApi<INpmsDashboardSortFormContentProps>((props) => {
  const { source, onSuccess, dialog, api, me } = props;
  const [formState, setFormState] = useState<INpmsDashboardSortFormState>(() => npmsDashboardSortFormQueryToFormState(source));
  const resetFromSource = useCallback(
    () => {
      setFormState(npmsDashboardSortFormQueryToFormState(source));
      setIsStale(false);
    },
    [source],
  );
  const [isStale, setIsStale] = useState(false);
  useUpdate(() => {
    const next = npmsDashboardSortFormQueryToFormState(source);
    // did the source in an important way?
    const changed = next.dashboards.length !== formState.dashboards.length;
    if (changed) { return void setIsStale(true); }
    for (let i = 0; i < next.dashboards.length; i += 1) {
      if (next.dashboards[i] !== formState.dashboards[i]) return void setIsStale(true);
    }
  }, [source]);

  const handleDragEnd: OnDragEndResponder = useCallback<OnDragEndResponder>((result) => {
    const { source, destination } = result;
    // dropped outside of drop-zone
    if (!destination) { return; }
    // dropped into different zone...
    if (source.droppableId !== destination.droppableId) { return; }
    // didn't move
    if (source.index === destination.index) { return ; }
    // update
    setFormState((prev) => {
      const dashboards = Array.from(prev.dashboards);
      // remove source
      const [removed] = dashboards.splice(source.index, 1);
      // add destination
      dashboards.splice(destination.index, 0, removed);
      return { ...prev, dashboards };
    });
  }, []);

  const [doSubmit, formResult] = useMutation<NpmsDashbortSortFormSubmitMutation, ApiException>(
    async () => {
      const vars: NpmsDashbortSortFormSubmitMutationVariables = {
        dashboard_ids: formState.dashboards.map(dash => Number(dash.id)),
      };
      const result = await api.gql<NpmsDashbortSortFormSubmitMutation, NpmsDashbortSortFormSubmitMutationVariables>(
        npmsDashbortSortFormMutation,
        vars,
      )
      return result;
    },
    { onSuccess, },
  );

  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const debugDialog = useDialog();

  const error = formResult.error;
  const isDisabled = formResult.isLoading;

  return (
    <>
      <JsonDialog title="Source" data={source} dialog={debugDialog} />
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DragDropContext onDragEnd={handleDragEnd}>
                <WithRandomId>
                  {(dragDropId) => (
                    <Droppable droppableId={dragDropId}>
                      {(provided) => (
                        <Grid ref={provided.innerRef} container spacing={2} >
                          {formState && formState.dashboards.map((dashboard, i) => (
                            <Grid key={dashboard.id} item xs={12}>
                              <Draggable draggableId={dashboard.id.toString()} index={i} >
                                {(provided, snapshot) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <Box p={1} border={1} borderColor="primary.main" borderRadius="borderRadius">
                                      <Typography className="text-center" component="h3">
                                        {`${i + 1}. ${dashboard.name}`}
                                      </Typography>
                                    </Box>
                                  </div>
                                )}
                              </Draggable>
                            </Grid>
                          ))}
                          {provided.placeholder}
                        </Grid>
                      )}
                    </Droppable>
                  )}
                </WithRandomId>
              </DragDropContext>
            </Grid>
            {error && (
              <Grid className="centered col" item xs={12} sm={12}>
                <FormHelperText error>
                  {error.message}
                </FormHelperText>
              </Grid>
            )}
            {isDisabled && (
              <Grid className="centered col" item xs={12} sm={12}>
                <CircularProgress />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <WhenDebugMode>
            <IconButton color="primary" onClick={debugDialog.doOpen}>
              <BugReportIcon />
            </IconButton>
          </WhenDebugMode>
          {isStale && (
            <Button startIcon={<RestoreIcon />} disabled={isDisabled} color="secondary" onClick={resetFromSource}>
              Ordering has been updated. Refresh?
            </Button>
          )}
          <Button disabled={isDisabled} color="primary" onClick={dialog.doClose}>
            Cancel
          </Button>
          <Button disabled={isDisabled} color="primary" type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  )
});