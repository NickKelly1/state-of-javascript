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
  InputLabel,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import { gql } from "graphql-request";
import produce from "immer";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useContext,
  useMemo,
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
import { OrNull } from "../../types/or-null.type";
import { useDialog } from "../../hooks/use-dialog.hook";
import { DebugJsonDialog } from "../debug-json-dialog/debug-json-dialog";
import { BugReport } from "@material-ui/icons";
import { WhenDebugMode } from "../../components-hoc/when-debug-mode/when-debug-mode";


const userMutateFormCreateMutation = gql`
mutation UserMutateFormCreate(
  $name:String!
  $email:String
  $password:String
){
  createUser(
    dto:{
      name:$name
      email:$email
      password:$password
    }
  ){
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
`;


const userMutateFormUpdateMutation = gql`
mutation UserMutateFormUpdate(
  $id:Int!
  $name:String
  $email:String
  $password:String
  $deactivated:Boolean
){
  updateUser(
    dto:{
      id:$id
      name:$name
      email:$email
      password:$password
      deactivated:$deactivated
    }
  ){
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
`;


export interface IUserMutateFormOnSuccessFnArg { id: Id; name: string };
export interface IUserMutateFormOnSuccessFn { (arg: IUserMutateFormOnSuccessFnArg): any }
export interface IUserMutateFormRole {
  id: Id;
  name: string;
  email?: OrNull<string>;
  verified?: OrNull<boolean>;
  deactivated: boolean;
  canUpdatePassword: boolean; 
  canDeactivate: boolean; 
};
export interface IUserMutateFormProps extends IWithDialogueProps {
  user?: OrNullable<IUserMutateFormRole>;
  onSuccess?: IUserMutateFormOnSuccessFn;
}


export const UserMutateFormDialog = WithDialogue<IUserMutateFormProps>({ fullWidth: true })((props) => {
  const { user, onSuccess, dialog, } = props;
  const { api, me, } = useContext(ApiContext);

  interface IFormState {
    name: string;
    email: string;
    password: string;
    deactivated?: boolean;
  };
  const [formState, setFormState] = useState<IFormState>(() => ({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    deactivated: user?.deactivated,
    verified: user?.verified,
  }));
  const [doSubmit, submitState] = useMutation<IUserMutateFormOnSuccessFnArg, ApiException>(
    async () => {
      if (ist.notNullable(user)) {
        // update
        const vars: UserMutateFormUpdateMutationVariables = {
          id: Number(user.id),
          name: formState.name,
          // undefined if empty string
          email: formState.email || undefined,
          // undefined if empty string
          password: formState.password || undefined,
          // set if given, otherwise undefined
          deactivated: formState.deactivated ?? undefined,
        };
        const result = await api.gql<UserMutateFormUpdateMutation, UserMutateFormUpdateMutationVariables>(
          userMutateFormUpdateMutation,
          vars
        );
        return {
          id: result.updateUser.data.id,
          name: result.updateUser.data.name,
        };
      }

      // create
      const vars: UserMutateFormCreateMutationVariables = {
        name: formState.name,
        // undefined if empty string
        email: formState.email || undefined,
        // undefined if empty string
        password: formState.password || undefined,
      };
      const result = await api.gql<UserMutateFormCreateMutation, UserMutateFormCreateMutationVariables>(
        userMutateFormCreateMutation,
        vars
      );
      return {
        id: result.createUser.data.id,
        name: result.createUser.data.name,
      };
    },
    { onSuccess, },
  )
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const handleNameChange = useCallback(change(setFormState, 'name'), [setFormState]);
  const handleDeactivatedChanged = useCallback(() => setFormState(prev => ({ ...prev, deactivated: !prev.deactivated })), [setFormState]);
  const handleEmailChange = useCallback(change(setFormState, 'email'), [setFormState]);
  const handlePasswordChange = useCallback(change(setFormState, 'password'), [setFormState]);

  const canEditPassword: boolean = useMemo(() => !user || user.canUpdatePassword, [user]);
  const canDeactivate: boolean = useMemo(() => !!user?.canDeactivate, [user]);
  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  const debugDialog = useDialog();

  return (
    <>
      <DebugJsonDialog title="User Mutate Form" dialog={debugDialog} data={formState} />
      <DialogTitle>
        {ist.defined(user) ? 'Edit user' : 'Create user'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {canDeactivate && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-start" alignItems="between" textAlign="center">
                  <Typography className="centered" component="span" variant="body2">
                    Deactivated
                  </Typography>
                  <Switch
                    color="primary"
                    checked={!!formState.deactivated}
                    onChange={handleDeactivatedChanged}
                    name="deactivated"
                    inputProps={{ 'aria-label': 'auto save' }}
                  />
                </Box>
              </Grid>
            )}
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
            <Grid item xs={12}>
              <TextField
                label="email"
                type="email"
                margin="dense"
                fullWidth
                disabled={isDisabled}
                value={formState.email}
                error={!!error?.data?.email}
                helperText={error?.data?.email?.join('\n')}
                onChange={handleEmailChange}
              />
            </Grid>
            {canEditPassword && (
              <Grid item xs={12}>
                <TextField
                  label="password"
                  type="password"
                  margin="dense"
                  fullWidth
                  disabled={isDisabled}
                  value={formState.password}
                  error={!!error?.data?.password}
                  helperText={error?.data?.password?.join('\n')}
                  onChange={handlePasswordChange}
                />
              </Grid>
            )}
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
          <WhenDebugMode>
            <IconButton onClick={debugDialog.doToggle} color="primary">
              <BugReport />
            </IconButton>
          </WhenDebugMode>
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
