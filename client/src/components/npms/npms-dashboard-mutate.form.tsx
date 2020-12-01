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
  Typography, 
  IconButton
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
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
import { DebugJsonDialog } from '../debug-json-dialog/debug-json-dialog';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import { WhenDebugMode } from '../../components-hoc/when-debug-mode/when-debug-mode';
import { OrNullable } from '../../types/or-nullable.type';
import { not } from '../../helpers/not.helper';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';
import { FormException } from '../form-error/form-exception.helper';

// TODO: updating vs creating...
const createNpmsDashboardQuery = gql`
mutation CreateNpmsDashboardForm(
  $name:String!,
  $npms_package_names:[String!]
){
  createNpmsDashboard(
    dto:{
      name:$name
      npms_package_names:$npms_package_names
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

const updateNpmsDashboardQuery = gql`
mutation UpdateNpmsDashboardForm(
  $id:Int!,
  $name:String!
  $npms_package_names:[String!]
){
  updateNpmsDashboard(
    dto:{
      id:$id,
      name:$name,
      npms_package_names:$npms_package_names
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
  hideItems?: boolean;
  initial?: {
    id: Id;
    name: string;
    packages: INpmsPackageSearchOption[];
  },
}

// interface IDashboardPackageOption { key: string; option: OrNull<INpmsPackageSearchOption>; };
type IDashboardPackageOption = { key: string; option: string; };
export const NpmsDashboardMutateForm = WithDialogue<INpmsDashboardMutateFormProps>({ fullWidth: true })(WithApi((props) => {
  const { onSuccess, initial, title, dialog, api, me, hideItems, } = props;
  const seq = useSequence();

  const _initial = useMemo(() => initial, []);
  interface IFormState { name: string; npmsPackages: IDashboardPackageOption[] };
  const [formState, setFormState] = useState<IFormState>(() => ({
    name: _initial?.name ?? '',
    npmsPackages: [
      ...(_initial?.packages ?? []).map((pkg): IDashboardPackageOption => ({ key: seq.next().toString(), option: pkg.name, })),
      { key: seq.next().toString(), option: '', },
    ]
  }));

  const addPackage = useCallback((option?: OrNullable<string>) => setFormState((prev): IFormState => {
    const npmsPackages = [
      ...prev.npmsPackages,
      { key: seq.next().toString(), option: option ?? '', },
    ];
    return { ...prev, npmsPackages };
  }), [setFormState]);

  const changePackage = useCallback((index: number, option: string) => setFormState((prev) => {
    const before = prev.npmsPackages.slice(0, index);
    const after = prev.npmsPackages.slice(index + 1, prev.npmsPackages.length);
    const target = prev.npmsPackages[index];
    const nextNpmsPackages: IDashboardPackageOption[] = [ ...before, { key: target.key, option }, ...after, ];
    return { ...prev, npmsPackages: nextNpmsPackages };
  }), [setFormState]);

  const removePackage = useCallback((index: number) => setFormState((prev) => {
    const before = prev.npmsPackages.slice(0, index);
    const after = prev.npmsPackages.slice(index + 1, prev.npmsPackages.length);
    const nextNpmsPackages = [ ...before, ...after, ];
    return { ...prev, npmsPackages: nextNpmsPackages };
  }), [setFormState]);

  const [doSubmit, submitState] = useMutation<INpmsDashboardMutateFormOnSuccessFnArg, IApiException>(
    async () => {
      const _vars = {
        name: formState.name,
        npms_package_names: formState
          .npmsPackages
          .map(pkg => pkg.option)
          .filter(ist.truthy),
      };

      if (ist.nullable(_initial)) {
        // create
        const vars: CreateNpmsDashboardFormMutationVariables = { name: _vars.name, };
        if (!hideItems) { vars.npms_package_names = _vars.npms_package_names; }
        const result = await api.gql<CreateNpmsDashboardFormMutation, CreateNpmsDashboardFormMutationVariables>(
          createNpmsDashboardQuery,
          vars,
        )
        const final: INpmsDashboardMutateFormOnSuccessFnArg = {
          id: result.createNpmsDashboard.data.id,
          name: result.createNpmsDashboard.data.name,
        }
        return final;
      }

      else {
        // update
        const vars: UpdateNpmsDashboardFormMutationVariables = { id: Number(_initial.id), name: _vars.name, };
        if (!hideItems) { vars.npms_package_names = _vars.npms_package_names; }
        const result = await api.gql<UpdateNpmsDashboardFormMutation, UpdateNpmsDashboardFormMutationVariables>(
          updateNpmsDashboardQuery,
          vars,
        )
        const final: INpmsDashboardMutateFormOnSuccessFnArg = {
          id: result.updateNpmsDashboard.data.id,
          name: result.updateNpmsDashboard.data.name,
        }
        return final;
      }
    },
    { onSuccess, },
  );

  const handleAddPackageClicked = useCallback(() => addPackage(), [addPackage]);
  const handleRemovePackageClicked = removePackage;
  const handleChangePackageName = changePackage;
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

  const debugDialog = useDialog();
  const debugData = useMemo(() => ({ formState, initial }), [formState, initial]);

  return (
    <>
      <DebugJsonDialog title="form" data={debugData} dialog={debugDialog} />
      {/* <NpmsPackageCreateForm dialog={createNpmsPackageDialog} onSuccess={handleNpmsPackageCreated} /> */}
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
            {!hideItems && (
              <>
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
                                      <div ref={provided.innerRef} {...provided.draggableProps}>
                                        <div className="centered">
                                          <Box className="centered" mr={1} {...provided.dragHandleProps}>
                                            <Box className="centered" border={0} borderColor={snapshot.isDragging ? 'primary' : 'grey.500'} borderRadius={4}>
                                              <DragIndicatorIcon color={snapshot.isDragging ? 'primary' : 'inherit'} />
                                            </Box>
                                          </Box>
                                          <TextField
                                            label="name"
                                            autoFocus
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            disabled={isDisabled}
                                            value={pkg.option}
                                            onChange={(evt) => handleChangePackageName(i, evt.target.value)}
                                          />
                                          <Box
                                            // Hide if the last option & is empty
                                            visibility={i === (formState.npmsPackages.length - 1) && pkg.option.trim() === '' ? 'hidden' : 'inherit'}
                                            pl={1}
                                          >
                                            <IconButton onClick={() => handleRemovePackageClicked(i)} color="primary" disabled={isDisabled} className="centered">
                                              <HighlightOffIcon />
                                            </IconButton>
                                          </Box>
                                        </div>
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
                <Grid className="centered" item xs={12}>
                  <Button
                    onClick={handleAddPackageClicked}
                    className="centered text-center"
                    startIcon={<AddCircleOutlineIcon />}
                    color="primary"
                  >
                    Add
                  </Button>
                </Grid>
              </>
            )}
            {error && (
              <Grid className="centered" item xs={12}>
                <FormException className="centered" exception={error} />
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
          <WhenDebugMode>
            <IconButton onClick={debugDialog.doToggle} color="primary">
              <BugReportIcon />
            </IconButton>
          </WhenDebugMode>
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
}))
