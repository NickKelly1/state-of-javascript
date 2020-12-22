import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, FormHelperText, Grid, TextField } from "@material-ui/core";
import { gql } from "graphql-request";
import React, { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import {
  MutateRoleFormUpdateMutation,
  MutateRoleFormUpdateMutationVariables,
  MutateRoleFromCreateMutation,
  MutateRoleFromCreateMutationVariables,
} from "../../generated/graphql";
import { change } from "../../helpers/change.helper";
import { ist } from "../../helpers/ist.helper";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { Id } from "../../types/id.type";
import { OrNullable } from "../../types/or-nullable.type";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";

const mutateRoleFormCreateMutation = gql`
mutation MutateRoleFromCreate(
  $name:String!
){
  createRole(
    dto:{
      name:$name
    }
  ){
    can{
      show
      update
      softDelete
      hardDelete
      createRolePermissions
    }
    data{
      id
      name
    }
  }
}
`;


const mutateRoleFormUpdateMutation = gql`
mutation MutateRoleFormUpdate(
  $id:Int!
  $name:String
){
  updateRole(
    dto:{
      id:$id
      name:$name
    }
  ){
    can{
      show
      update
      softDelete
      hardDelete
      createRolePermissions
    }
    data{
      id
      name
    }
  }
}
`;

export interface IRoleMutateFormOnSuccessFnArg { id: Id; name: string }
export interface IRoleMutateFormOnSuccessFn { (arg: IRoleMutateFormOnSuccessFnArg): any }
export interface IRoleMutateFormRole { id: Id; name: string; }
export interface IRoleMutateFormProps extends IWithDialogueProps {
  role?: OrNullable<IRoleMutateFormRole>;
  onSuccess?: IRoleMutateFormOnSuccessFn;
}

export const RoleMutateFormDialog = WithDialogue<IRoleMutateFormProps>({ fullWidth: true })(WithApi((props) => {
  const { role, onSuccess, dialog, api, me } = props;

  interface IFormState { name: string; }
  const [formState, setFormState] = useState<IFormState>(() => ({ name: role?.name ?? '', }));
  const [doSubmit, submitState] = useMutation<IRoleMutateFormOnSuccessFnArg, ApiException>(
    async () => {
      if (ist.notNullable(role)) {
        // update
        const vars: MutateRoleFormUpdateMutationVariables = {
          id: Number(role.id),
          name: formState.name,
        };
        const result = await api.gql<MutateRoleFormUpdateMutation, MutateRoleFormUpdateMutationVariables>(
          mutateRoleFormUpdateMutation,
          vars
        );
        return {
          id: result.updateRole.data.id,
          name: result.updateRole.data.name,
        };
      }

      // create
      const vars: MutateRoleFromCreateMutationVariables = {
        name: formState.name,
      };
      const result = await api.gql<MutateRoleFromCreateMutation, MutateRoleFromCreateMutationVariables>(
        mutateRoleFormCreateMutation,
        vars
      );
      return {
        id: result.createRole.data.id,
        name: result.createRole.data.name,
      };
    },
    { onSuccess, },
  )
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const handleNameChange = useCallback(change(setFormState, 'name'), [setFormState]);


  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  return (
    <>
      <DialogTitle>
        {ist.defined(role) ? 'Edit role' : 'Create role'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="name"
                margin="dense"
                autoFocus
                fullWidth
                disabled={isDisabled}
                value={formState.name}
                error={!!error?.data?.name}
                helperText={error?.data?.name?.join('\n')}
                onChange={handleNameChange}
              />
            </Grid>
            {error && (
              <Grid className="centered col" item xs={12}>
                <FormHelperText error>
                  {error.message}
                </FormHelperText>
              </Grid>
            )}
            {isDisabled && (
              <Grid className="centered col" item xs={12}>
                <CircularProgress />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" disabled={isDisabled} onClick={dialog.doClose}>
            Close
          </Button>
          <Button color="primary" disabled={isDisabled} type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  );
}));
