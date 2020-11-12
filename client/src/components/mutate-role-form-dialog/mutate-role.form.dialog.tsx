import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, FormHelperText, Grid, InputLabel, TextField } from "@material-ui/core";
import { gql } from "graphql-request";
import produce from "immer";
import React, { ChangeEventHandler, FormEventHandler, MouseEventHandler, useCallback, useContext, useState } from "react";
import { useMutation } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { ApiContext } from "../../contexts/api.context";
import { MutateRoleFormUpdateMutation, MutateRoleFormUpdateMutationVariables, MutateRoleFromCreateMutation, MutateRoleFromCreateMutationVariables } from "../../generated/graphql";
import { change } from "../../helpers/change.helper";
import { ist } from "../../helpers/ist.helper";
import { useFormStyles } from "../../hooks/use-form-styles.hook";
import { useUpdate } from "../../hooks/use-update.hook";
import { Id } from "../../types/id.type";
import { OrNullable } from "../../types/or-nullable.type";
import { IWithDialogueProps, WithDialogue } from "../with-dialog/with-dialog";

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
      delete
      createRolePermission
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
      delete
      createRolePermission
    }
    data{
      id
      name
    }
  }
}
`;

export interface IMutateRoleFormOnSuccessFnArg { id: Id; name: string };
export interface IMutateRoleFormOnSuccessFn { (arg: IMutateRoleFormOnSuccessFnArg): any }
export interface IMutateRoleFormRole { id: Id; name: string; };
export interface IMutateRoleFormProps extends IWithDialogueProps {
  role?: OrNullable<IMutateRoleFormRole>;
  onSuccess?: IMutateRoleFormOnSuccessFn;
}

export const  MutateRoleFormDialog = WithDialogue<IMutateRoleFormProps>({ fullWidth: true })((props) => {
  const { role, onSuccess, dialog, } = props;
  const { api, me, } = useContext(ApiContext);

  const formClasses = useFormStyles();

  interface IFormState { name: string; };
  const [formState, setFormState] = useState<IFormState>(() => ({ name: role?.name ?? '', }));
  const [doSubmit, submitState] = useMutation<IMutateRoleFormOnSuccessFnArg, ApiException>(
    async () => {
      if (ist.notNullable(role)) {
        // update
        const vars: MutateRoleFormUpdateMutationVariables = {
          id: Number(role.id),
          name: formState.name,
        };
        const result = await api
          .connector
          .graphql<MutateRoleFormUpdateMutation, MutateRoleFormUpdateMutationVariables>(
            mutateRoleFormUpdateMutation,
            vars
          )
          .catch(rethrow(normaliseApiException));
        return {
          id: result.updateRole.data.id,
          name: result.updateRole.data.name,
        };
      }

      // create
      const vars: MutateRoleFromCreateMutationVariables = {
        name: formState.name,
      };
      const result = await api
        .connector
        .graphql<MutateRoleFromCreateMutation, MutateRoleFromCreateMutationVariables>(
          mutateRoleFormCreateMutation,
          vars
        )
        .catch(rethrow(normaliseApiException));
      return {
        id: result.createRole.data.id,
        name: result.createRole.data.name,
      };
    },
    { onSuccess, },
  )
  const handleSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(() => doSubmit(), [doSubmit]);
  const handleNameChange = useCallback(change(setFormState, 'name'), [setFormState]);


  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  return (
    <>
      <DialogTitle>
        {ist.defined(role) ? 'Edit role' : 'Create role'}
      </DialogTitle>
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
        <Button color="primary" disabled={isDisabled} onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </>
  );
});
