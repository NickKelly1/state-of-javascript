import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
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
} from '../../backend-api/normalise-api-exception.helper';
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { ApiContext } from '../../components-contexts/api.context';
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
  NpmsPackageCreateForm,
  INpmsPackageCreateFormOnSuccessFn,
} from './npms-package-create.form';
import {
  INpmsPackageSearchOption,
  NpmsPackageComboSearch,
} from './npms-package-combo-search';
import { WithRandomId } from '../../components-hoc/with-random-id/with-random-id';
import { useDialog } from '../../hooks/use-dialog.hook';
import { useSubmitForm } from '../../hooks/use-submit-form.hook';
import { IWithDialogueProps, WithDialogue } from '../../components-hoc/with-dialog/with-dialog';
import { change } from '../../helpers/change.helper';

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
      softDelete
      hardDelete
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
      softDelete
      hardDelete
    }
    data{
      id
      name
    }
  }
}
`;


export interface INpmsDashboardMutateFormOnSuccessFnArg { id: Id; name: string; };
export interface INpmsDashboardMutateFormOnSuccessFn {
  (result: INpmsDashboardMutateFormOnSuccessFnArg): any;
}
export interface INpmsDashboardMutateFormProps extends IWithDialogueProps {
  title?: string;
  onSuccess?: INpmsDashboardMutateFormOnSuccessFn;
  initial?: {
    id: Id;
    name: string;
    packages: INpmsPackageSearchOption[];
  },
}

interface IDashboardPackageOption { key: string; option: OrNull<INpmsPackageSearchOption>; };
export const NpmsDashboardMutateForm = WithDialogue<INpmsDashboardMutateFormProps>({ fullWidth: true })((props) => {
  const { onSuccess, initial, title, dialog } = props;
  const { api, me } = useContext(ApiContext);
  const seq = useSequence();

  const _initial = useMemo(() => initial, []);
  interface IFormState { name: string; npmsPackages: IDashboardPackageOption[] };
  const [formState, setFormState] = useState<IFormState>(() => ({
    name: _initial?.name ?? '',
    npmsPackages: [
      ...(_initial?.packages ?? []).map((option): IDashboardPackageOption => ({ key: seq.next().toString(), option, })),
      { key: seq.next().toString(), option: null, },
    ]
  }));

  const addPackage = useCallback((option: OrNull<INpmsPackageSearchOption>) => setFormState((prev) => {
    const npmsPackages = [
      ...prev.npmsPackages,
      { key: seq.next().toString(), option, },
    ];
    // make sure theres an empty entry at the end...
    if (ist.notNullable(npmsPackages[npmsPackages.length - 1]?.option)) {
      npmsPackages.push({ key: seq.next().toString(), option: null });
    }
    return { ...prev, npmsPackages };
  }), [setFormState]);

  const changePackage = useCallback((index: number, option: OrNull<INpmsPackageSearchOption>) => setFormState((prev) => {
    const before = prev.npmsPackages.slice(0, index);
    const after = prev.npmsPackages.slice(index + 1, prev.npmsPackages.length);
    const target = prev.npmsPackages[index];
    const npmsPackages: IDashboardPackageOption[] = [ ...before, { key: target.key, option }, ...after, ];
    // make sure theres an empty entry at the end...
    if (ist.notNullable(npmsPackages[npmsPackages.length - 1]?.option)) {
      npmsPackages.push({ key: seq.next().toString(), option: null });
    }
    return { ...prev, npmsPackages };
  }), [setFormState]);

  const removePackage = useCallback((index: number) => setFormState((prev) => {
    const before = prev.npmsPackages.slice(0, index);
    const after = prev.npmsPackages.slice(index + 1, prev.npmsPackages.length);
    const npmsPackages = [ ...before, ...after, ];
    // make sure theres an empty entry at the end...
    if (ist.notNullable(npmsPackages[npmsPackages.length - 1]?.option)) {
      npmsPackages.push({ key: seq.next().toString(), option: null });
    }
    return { ...prev, npmsPackages };
  }), [setFormState]);

  const [doSubmit, submitState] = useMutation<INpmsDashboardMutateFormOnSuccessFnArg, IApiException>(
    async () => {
      const _vars = {
        name: formState.name,
        npms_package_ids: formState
          .npmsPackages
          .map(pkg => pkg.option?.id)
          .filter(ist.notNullable)
          .map(Number),
      };

      if (ist.nullable(_initial)) {
        // create
        const vars: CreateNpmsDashboardFormMutationVariables = {
          name: _vars.name,
          npms_package_ids: _vars.npms_package_ids,
        };
        const result = await api
          .connector
          .graphql<CreateNpmsDashboardFormMutation, CreateNpmsDashboardFormMutationVariables>(
            CreateNpmsDashboardQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException));
        const final: INpmsDashboardMutateFormOnSuccessFnArg = {
          id: result.createNpmsDashboard.data.id,
          name: result.createNpmsDashboard.data.name,
        }
        return final;
      }

      else {
        // update
        const vars: UpdateNpmsDashboardFormMutationVariables = {
          id: Number(_initial.id),
          name: _vars.name,
          npms_package_ids: _vars.npms_package_ids,
        };
        const result = await api
          .connector
          .graphql<UpdateNpmsDashboardFormMutation, UpdateNpmsDashboardFormMutationVariables>(
            UpdateNpmsDashboardQuery,
            vars,
          )
          .catch(rethrow(normaliseApiException));
        const final: INpmsDashboardMutateFormOnSuccessFnArg = {
          id: result.updateNpmsDashboard.data.id,
          name: result.updateNpmsDashboard.data.name,
        }
        return final;
      }
    },
    { onSuccess, },
  );

  const createNpmsPackageDialog = useDialog();

  const handleChangePackage = useCallback((index: number, option: OrNull<INpmsPackageSearchOption>) => {
    if (ist.nullable(option)) return void removePackage(index);
    return void changePackage(index, option);
  }, [changePackage, removePackage]);

  const handleNpmsPackageCreated: INpmsPackageCreateFormOnSuccessFn = useCallback((result) => {
    addPackage({ id: result.createNpmsPackage.data.id, name: result.createNpmsPackage.data.name, });
    createNpmsPackageDialog.doClose();
  }, [addPackage, createNpmsPackageDialog.doClose]);

  const handleChangeName = useCallback(change(setFormState, 'name'), [setFormState]);
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);

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
      const npmsPackages = Array.from(prev.npmsPackages);
      // remove source
      const [removed] = npmsPackages.splice(source.index, 1);
      // add destination
      npmsPackages.splice(destination.index, 0, removed);
      return { ...prev, npmsPackages };
    });
  }, []);

  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  return (
    <>
      <NpmsPackageCreateForm dialog={createNpmsPackageDialog} onSuccess={handleNpmsPackageCreated} />
      <DialogTitle>{`${initial?.id ? 'Edit' : 'Create'} Npms Dashbard`}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="name"
                fullWidth
                autoFocus
                margin="dense"
                disabled={isDisabled}
                value={formState.name}
                error={!!error?.data?.name}
                helperText={error?.data?.name?.join('\n')}
                onChange={handleChangeName}
              />
              {_initial && (_initial.name !== formState.name) && (
                <FormHelperText>
                  {`formerly ${_initial.name}`}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={createNpmsPackageDialog.doOpen}
                className="centered text-center"
                startIcon={<AddCircleOutlineIcon />}
                color="primary"
              >
                Link a new package
              </Button>
            </Grid>
            <Grid item xs={12}>
              <DragDropContext onDragEnd={handleDragEnd}>
                <WithRandomId>
                  {(dragDropId) => (
                    <Droppable droppableId={dragDropId}>
                      {(provided, snapshot) => (
                        <Grid ref={provided.innerRef} container spacing={2} >
                          {formState.npmsPackages.filter(ist.notNullable).map((pkg, i) => (
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
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={dialog.doClose}>
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  );
})
