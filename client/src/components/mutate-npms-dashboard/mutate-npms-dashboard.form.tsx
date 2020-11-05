import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  Modal,
  Paper,
  TextField,
  Typography } from '@material-ui/core';
import immu from 'immutability-helper';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import clsx from 'clsx';
import { gql } from 'graphql-request';
import React, {
  FormEventHandler,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder } from 'react-beautiful-dnd';
import { useMutation } from 'react-query';
import {
  normaliseApiException,
  rethrow,
} from '../../backend-api/make-api-exception.helper';
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { ApiContext } from '../../contexts/api.context';
import {
  CreateNpmsDashboardFormMutation,
  CreateNpmsDashboardFormMutationVariables,
  UpdateNpmsDashboardFormMutation,
  UpdateNpmsDashboardFormMutationVariables,
} from '../../generated/graphql';
import { ist } from '../../helpers/ist.helper';
import { useSequence } from '../../hooks/use-sequence.hook';
import { Id } from '../../types/id.type';
import { OrNull } from '../../types/or-null.type';
import {
  MutateNpmsPackageForm,
  IMutateNpmsPackageFormOnSuccessFn,
} from '../mutate-npms-package/mutate-npms-package.form';
import {
  INpmsPackageSearchOption,
  NpmsPackageComboSearch,
} from '../npms-package-combo-search/npms-package-combo-search';
import {
  WithRandomId,
} from '../with-random-id/with-random-id';

// TODO: updating vs creating...
const CreateNpmsDashboardQuery = gql`
mutation CreateNpmsDashboardForm(
  $name:String!,
  $npms_package_ids:[Int!]
){
  createNpmsDashboard(
    dto:{
      name:$name
      npms_package_ids:$npms_package_ids
    }
  ){
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
  }
}
`;

const UpdateNpmsDashboardQuery = gql`
mutation UpdateNpmsDashboardForm(
  $id:Int!,
  $name:String!
  $npms_package_ids:[Int!]
){
  updateNpmsDashboard(
    dto:{
      id:$id,
      name:$name,
      npms_package_ids:$npms_package_ids
    }
  ){
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
  }
}
`;


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  label: {
    paddingBottom: theme.spacing(1),
  },
  group: {
    marginBottom: theme.spacing(2),
  },
}));


export interface IMutateNpmsDashboardFormOnSuccessFnArg { id: Id; name: string; };
export interface IMutateNpmsDashboardFormOnSuccessFn {
  (result: IMutateNpmsDashboardFormOnSuccessFnArg): any;
}
export interface IMutateNpmsDashboardFormProps {
  title?: string;
  onSuccess?: IMutateNpmsDashboardFormOnSuccessFn;
  initial?: {
    id: Id;
    name: string;
    packages: INpmsPackageSearchOption[];
  },
}

interface IDashboardPackageOption { key: string; option: OrNull<INpmsPackageSearchOption>; };

export function MutateNpmsDashboardForm(props: IMutateNpmsDashboardFormProps) {
  const { onSuccess, initial, title } = props;
  const classes = useStyles();
  const { api, me } = useContext(ApiContext);
  const seq = useSequence();

  const _initial = useMemo(() => initial, []);
  const [dashboardName, setDashboardName] = useState(_initial?.name ?? '');
  const [packages, setPackages] = useState<IDashboardPackageOption[]>(() => [
    ...(_initial?.packages ?? []).map((option): IDashboardPackageOption => ({ key: seq.next().toString(), option, })),
    { key: seq.next().toString(), option: null, },
  ]);

  const addPackage = useCallback((option: OrNull<INpmsPackageSearchOption>) => setPackages((prev) => {
    const next = [
      ...prev,
      { key: seq.next().toString(), option, },
    ];
    // make sure theres an empty entry at the end...
    if (ist.notNullable(next[next.length - 1]?.option)) {
      next.push({ key: seq.next().toString(), option: null });
    }
    return next;
  }), []);

  const changePackage = useCallback((index: number, option: OrNull<INpmsPackageSearchOption>) => setPackages((prev) => {
    const before = prev.slice(0, index);
    const after = prev.slice(index + 1, prev.length);
    const target = prev[index];
    const next: IDashboardPackageOption[] = [ ...before, { key: target.key, option }, ...after, ];
    // make sure theres an empty entry at the end...
    if (ist.notNullable(next[next.length - 1]?.option)) {
      next.push({ key: seq.next().toString(), option: null });
    }
    return next;
  }), []);

  const removePackage = useCallback((index: number) => setPackages((prev) => {
    const before = prev.slice(0, index);
    const after = prev.slice(index + 1, prev.length);
    const next = [ ...before, ...after, ];
    // make sure theres an empty entry at the end...
    if (ist.notNullable(next[next.length - 1]?.option)) {
      next.push({ key: seq.next().toString(), option: null });
    }
    return next;
  }), []);

  const handleChangePackage = useCallback((index: number, option: OrNull<INpmsPackageSearchOption>) => {
    if (ist.nullable(option)) return void removePackage(index);
    return void changePackage(index, option);
  }, [changePackage, removePackage]);

  const [createNpmsPackageModalOpen, setCreateNpmsPackageModalOpen] = useState(false);

  const handleNpmsPackageCreated: IMutateNpmsPackageFormOnSuccessFn = useCallback((result) => {
    addPackage({ id: result.createNpmsPackage.data.id, name: result.createNpmsPackage.data.name, });
    setCreateNpmsPackageModalOpen(false);
  }, []);

  interface ISubmitFnArgs { name: string; npms_package_ids: number[]; }
  const [submitForm, formState] = useMutation<IMutateNpmsDashboardFormOnSuccessFnArg, IApiException, ISubmitFnArgs>(
    async (arg: ISubmitFnArgs) => {
      if (ist.nullable(_initial)) {
        // create
        const vars: CreateNpmsDashboardFormMutationVariables = {
          name: arg.name,
          npms_package_ids: arg.npms_package_ids,
        };
        const result = await api
          .connector
          .graphql<CreateNpmsDashboardFormMutation, CreateNpmsDashboardFormMutationVariables>(
            CreateNpmsDashboardQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException));
        const final: IMutateNpmsDashboardFormOnSuccessFnArg = {
          id: result.createNpmsDashboard.data.id,
          name: result.createNpmsDashboard.data.name,
        }
        return final;
      }

      else {
        // update
        const vars: UpdateNpmsDashboardFormMutationVariables = {
          id: Number(_initial.id),
          name: arg.name,
          npms_package_ids: arg.npms_package_ids,
        };
        const result = await api
          .connector
          .graphql<UpdateNpmsDashboardFormMutation, UpdateNpmsDashboardFormMutationVariables>(
            UpdateNpmsDashboardQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException));
        const final: IMutateNpmsDashboardFormOnSuccessFnArg = {
          id: result.updateNpmsDashboard.data.id,
          name: result.updateNpmsDashboard.data.name,
        }
        return final;
      }
    },
    { onSuccess, },
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    submitForm({
      name: dashboardName,
      npms_package_ids: packages.map(pkg => pkg.option?.id).filter(ist.notNullable).map(Number),
    });
  }, [packages, dashboardName]);

  const isDisabled = formState.isLoading;
  const error = formState.error;

  const handleDragEnd: OnDragEndResponder = useCallback<OnDragEndResponder>((result) => {
    const { source, destination } = result;
    // dropped outside of drop-zone
    if (!destination) { return; }
    // dropped into different zone...
    if (source.droppableId !== destination.droppableId) { return; }
    // didn't move
    if (source.index === destination.index) { return ; }
    // update
    setPackages((prev) => {
      const next = Array.from(prev);
      // remove source
      const [removed] = next.splice(source.index, 1);
      // add destination
      next.splice(destination.index, 0, removed);
      return next;
    });
  }, []);

  return (
    <>
      <Modal
        open={createNpmsPackageModalOpen}
        onClose={() => setCreateNpmsPackageModalOpen(false)}
        className="modal"
        aria-labelledby="edit-dashboard"
        aria-describedby="edit-dashboard"
      >
        <Paper className={clsx('modal-content', classes.paper)}>
          <MutateNpmsPackageForm onSuccess={handleNpmsPackageCreated} />
        </Paper>
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {title && (
                <Grid item xs={12}>
                  <Typography component="h2" variant="h2">
                    title
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <InputLabel className={classes.label} htmlFor="create_npms_dashboard_name">name</InputLabel>
                <TextField
                  id="create_npms_dashboard_name"
                  disabled={isDisabled}
                  value={dashboardName}
                  error={!!error?.data?.name}
                  helperText={error?.data?.name?.join('\n')}
                  onChange={(evt) => { setDashboardName(evt.target.value); }}
                />
                {_initial && (_initial.name !== dashboardName) && (
                  <FormHelperText>
                    {`formerly ${_initial.name}`}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <WithRandomId>
                    {(dragDropId) => (
                      <Droppable droppableId={dragDropId}>
                        {(provided, snapshot) => (
                          <Grid ref={provided.innerRef} container spacing={2} >
                            {packages.filter(ist.notNullable).map((pkg, i) => (
                              <Grid key={pkg.key} item xs={12}>
                                <Draggable draggableId={pkg.key} index={i} >
                                  {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                      <NpmsPackageComboSearch
                                        option={pkg.option}
                                        error={!!error?.data?.npms_package_ids}
                                        isDisabled={isDisabled}
                                        onChange={(option) => handleChangePackage(i, option)}
                                      />
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
              {formState.error
                && formState.error.data?.npms_package_ids
                && formState.error.data.npms_package_ids.map((desc, i) => (
                  <FormHelperText key={`${desc}${i.toString()}`} error>
                    {desc}
                  </FormHelperText>
                ))
              }
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => setCreateNpmsPackageModalOpen(true)}
                  className="centered text-center"
                >
                  <Box className="centered" mr={2}>
                    <AddCircleOutlineIcon />
                  </Box>
                  <Box>
                    Link a new package
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  type="submit">
                  Submit
                </Button>
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <FormHelperText className="centered" error>
                    {error.message}
                  </FormHelperText>
                </Grid>
              )}
              {isDisabled && (
                <Grid className="centered" item xs={12} sm={12}>
                  <CircularProgress />
                </Grid>
              )}
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
}
