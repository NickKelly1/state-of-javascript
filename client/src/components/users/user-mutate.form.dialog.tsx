import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputLabel,
  TextField
} from "@material-ui/core";
import { gql } from "graphql-request";
import produce from "immer";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useContext,
  useState,
} from "react";
import { useMutation } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { ApiContext } from "../../components-contexts/api.context";
import {
  UserMutateFormUpdateMutation,
  UserMutateFormUpdateMutationVariables,
  UserMutateFormCreateMutation,
  UserMutateFormCreateMutationVariables,
  // usermutatform,
} from "../../generated/graphql";
import { change } from "../../helpers/change.helper";
import { ist } from "../../helpers/ist.helper";
import { useFormStyles } from "../../hooks/use-form-styles.hook";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { useUpdate } from "../../hooks/use-update.hook";
import { Id } from "../../types/id.type";
import { OrNullable } from "../../types/or-nullable.type";


const userMutateFormCreateMutation = gql`
mutation UserMutateFormCreate(
  $name:String!
){
  createUser(
    dto:{
      name:$name
    }
  ){
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
`;


const userMutateFormUpdateMutation = gql`
mutation UserMutateFormUpdate(
  $id:Int!
  $name:String
){
  updateUser(
    dto:{
      id:$id
      name:$name
    }
  ){
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
`;


export interface IUserMutateFormOnSuccessFnArg { id: Id; name: string };
export interface IUserMutateFormOnSuccessFn { (arg: IUserMutateFormOnSuccessFnArg): any }
export interface IUserMutateFormRole { id: Id; name: string; };
export interface IUserMutateFormProps extends IWithDialogueProps {
  user?: OrNullable<IUserMutateFormRole>;
  onSuccess?: IUserMutateFormOnSuccessFn;
}


export const UserMutateFormDialog = WithDialogue<IUserMutateFormProps>({ fullWidth: true })((props) => {
  const { user, onSuccess, dialog, } = props;
  const { api, me, } = useContext(ApiContext);

  interface IFormState { name: string; };
  const [formState, setFormState] = useState<IFormState>(() => ({ name: user?.name ?? '', }));
  const [doSubmit, submitState] = useMutation<IUserMutateFormOnSuccessFnArg, ApiException>(
    async () => {
      if (ist.notNullable(user)) {
        // update
        const vars: UserMutateFormUpdateMutationVariables = {
          id: Number(user.id),
          name: formState.name,
        };
        const result = await api
          .connector
          .graphql<UserMutateFormUpdateMutation, UserMutateFormUpdateMutationVariables>(
            userMutateFormUpdateMutation,
            vars
          )
          .catch(rethrow(normaliseApiException));
        return {
          id: result.updateUser.data.id,
          name: result.updateUser.data.name,
        };
      }

      // create
      const vars: UserMutateFormCreateMutationVariables = {
        name: formState.name,
      };
      const result = await api
        .connector
        .graphql<UserMutateFormCreateMutation, UserMutateFormCreateMutationVariables>(
          userMutateFormCreateMutation,
          vars
        )
        .catch(rethrow(normaliseApiException));
      return {
        id: result.createUser.data.id,
        name: result.createUser.data.name,
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
        {ist.defined(user) ? 'Edit user' : 'Create user'}
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
});
