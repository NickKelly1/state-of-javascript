import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormHelperText, Grid, Typography } from '@material-ui/core';
import BugReportIcon from '@material-ui/icons/BugReport';
import { gql } from 'graphql-request';
import React, { FormEventHandler, useCallback, useContext, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';
import { useMutation, useQuery } from 'react-query';
import { ApiException } from '../../backend-api/api.exception';
import { normaliseApiException, rethrow } from '../../backend-api/normalise-api-exception.helper';
import { ApiContext } from '../../contexts/api.context';
import { DebugModeContext } from '../../contexts/debug-mode.context';
import { NpmsDashbortSortFormQuery, NpmsDashbortSortFormQueryVariables, NpmsDashbortSortFormSubmitMutation, NpmsDashbortSortFormSubmitMutationVariables } from '../../generated/graphql';
import { ist } from '../../helpers/ist.helper';
import { useUpdate } from '../../hooks/use-update.hook';
import { Id } from '../../types/id.type';
import { OrUndefined } from '../../types/or-undefined.type';
import { DebugException } from '../debug-exception/debug-exception';
import { JsonDownloadButton } from '../json-download-button/json-download-button';
import { JsonPretty } from '../json-pretty/json-pretty';
import { NpmsPackageComboSearch } from '../npms-package-combo-search/npms-package-combo-search';
import { WhenDebugMode } from '../when-debug-mode/when-debug-mode';
import { WithRandomId } from '../with-random-id/with-random-id';

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
        delete
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
export interface INpmsDashboardSortFormProps {
  onSuccess?: INpmsDashboardSortFormPropsOnSuccessFn;
}

const defaultQueryVars: NpmsDashbortSortFormQueryVariables = {
  dashboardLimit: 1000,
  dashboardOffset: 0,
}

export function NpmsDashboardSortForm(props: INpmsDashboardSortFormProps) {
  const { onSuccess } = props;
  const { api, me } = useContext(ApiContext);

  const [vars, setVars] = useState<NpmsDashbortSortFormQueryVariables>({
    dashboardLimit: defaultQueryVars.dashboardLimit,
    dashboardOffset: defaultQueryVars.dashboardOffset,
  });
  const queryFn = useCallback(async (): Promise<NpmsDashbortSortFormQuery> => {
    const result = await api
      .connector
      .graphql<NpmsDashbortSortFormQuery, NpmsDashbortSortFormQueryVariables>(
        npmsDashboardSortFormQuery,
        vars
      )
      .catch(rethrow(normaliseApiException));
    return result;
  }, [api, me, vars]);
  const { data, error, isLoading, refetch } = useQuery<NpmsDashbortSortFormQuery, ApiException>(
    NpmsDashbortSortFormQueryName,
    queryFn,
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {!data && (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        )}
        {error && (
          <Grid item xs={12}>
            <DebugException always exception={error} />
          </Grid>
        )}
        {data && (
          <Grid item xs={12}>
            <NpmsDashboardSortFormList
              onSuccess={onSuccess}
              source={data}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}


interface INpmsDashboardSortFormListProps {
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
};

function NpmsDashboardSortFormList(props: INpmsDashboardSortFormListProps) {
  const { source, onSuccess } = props;
  const { me, api } = useContext(ApiContext);
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
    let changed = next.dashboards.length !== formState.dashboards.length;
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

  const [doSubmit, formResult] = useMutation<NpmsDashbortSortFormSubmitMutation, ApiException, NpmsDashbortSortFormSubmitMutationVariables>(
    async (vars) => {
      const result = await api
        .connector
        .graphql<NpmsDashbortSortFormSubmitMutation, NpmsDashbortSortFormSubmitMutationVariables>(
          npmsDashbortSortFormMutation,
          vars,
        )
        .catch(rethrow(normaliseApiException));

      return result;
    },
    { onSuccess, },
  );

  const handleFormSubmitted: FormEventHandler<HTMLFormElement> = useCallback(
    (evt) => {
      evt.preventDefault();
      doSubmit({ dashboard_ids: formState.dashboards.map(dash => Number(dash.id)) });
    },
    [formState, doSubmit],
  );

  const [debugDialogIsOpen, setDebugDialogIsOpen] = useState<boolean>(false);
  const closeDebugDialog = useCallback(() => setDebugDialogIsOpen(false), []);
  const openDebugDialog = useCallback(() => setDebugDialogIsOpen(true), []);

  const error = formResult.error;
  const isDisabled = formResult.isLoading;

  return (
    <>
      <Dialog open={debugDialogIsOpen} onClose={closeDebugDialog}>
        <DialogTitle>
          Create Dashboard
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box mx={3} p={3} display="flex" justifyContent="flex-start" alignItems="flex-start" flexDirection="column">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography component="h2">
                    Source
                  </Typography>
                  <Box ml={2}>
                    <JsonDownloadButton name={`sort-dashboards-data`} src={source} />
                  </Box>
                </Box>
                <JsonPretty src={source} />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Grid container spacing={2}>
        <Grid className="centered col" item xs={12}>
          <WhenDebugMode>
            <Button onClick={openDebugDialog}>
              <BugReportIcon />
            </Button>
          </WhenDebugMode>
        </Grid>
        <Grid className="centered col" item xs={12}>
          {isStale && (
            <Button disabled={isDisabled} variant="outlined" color="secondary" onClick={resetFromSource}>
              Ordering has been updated. Refresh?
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleFormSubmitted}>
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
                                      <Box p={3} border={1} borderColor="primary.main" borderRadius="borderRadius">
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
              <Grid className="centered col" item xs={12}>
                <Button disabled={isDisabled} variant="outlined" type="submit">
                  Submit
                </Button>
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
          </form>
        </Grid>
      </Grid>
    </>
  )
}