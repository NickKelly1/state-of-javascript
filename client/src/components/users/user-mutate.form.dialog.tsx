import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import { gql } from "graphql-request";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import { useMutation } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import {
  UserMutateFormUpdateMutation,
  UserMutateFormUpdateMutationVariables,
  UserMutateFormCreateMutation,
  UserMutateFormCreateMutationVariables,
  // usermutatform,
} from "../../generated/graphql";
import { change } from "../../helpers/change.helper";
import { ist } from "../../helpers/ist.helper";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { Id } from "../../types/id.type";
import { OrNullable } from "../../types/or-nullable.type";
import { OrNull } from "../../types/or-null.type";
import { useDialog } from "../../hooks/use-dialog.hook";
import { JsonDialog } from "../debug-json-dialog/json-dialog";
import BugReportIcon from "@material-ui/icons/BugReportOutlined";
import { WhenDebugMode } from "../../components-hoc/when-debug-mode/when-debug-mode";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { ExceptionButton } from "../exception-button/exception-button.helper";


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
  $verified:Boolean
){
  updateUser(
    dto:{
      id:$id
      name:$name
      email:$email
      password:$password
      deactivated:$deactivated
      verified:$verified
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
  canUpdate: boolean; 
  canUpdatePassword: boolean; 
  canDeactivate: boolean; 
  canForceVerify: boolean;
  canForceUpdateEmail: boolean;
};
export interface IUserMutateFormProps extends IWithDialogueProps {
  user?: OrNullable<IUserMutateFormRole>;
  onSuccess?: IUserMutateFormOnSuccessFn;
}


export const UserMutateFormDialog = WithDialogue<IUserMutateFormProps>({ fullWidth: true })(WithApi((props) => {
  const {
    user,
    onSuccess,
    dialog,
    api,
    me,
  } = props;

  interface IFormState {
    name: string;
    email: string;
    password: string;
    deactivated?: boolean;
    verified?: boolean;
  };
  const [formState, setFormState] = useState<IFormState>((): IFormState => ({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    deactivated: user?.deactivated,
    verified: user?.verified ?? undefined,
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
          // set if given, otherwise undefined
          verified: formState.verified ?? undefined,
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
  const handleVerifiedChanged = useCallback(() => setFormState(prev => ({ ...prev, verified: !prev.verified })), [setFormState]);
  const handleEmailChange = useCallback(change(setFormState, 'email'), [setFormState]);
  const handlePasswordChange = useCallback(change(setFormState, 'password'), [setFormState]);

  const canUpdate: boolean = useMemo(() => !user || user.canUpdate, [user]);
  const canEditPassword: boolean = useMemo(() => !user || user.canUpdatePassword, [user]);
  const canDeactivate: boolean = useMemo(() => !!user?.canDeactivate, [user]);
  const canForceVerify: boolean = useMemo(() => !!user?.canForceVerify, [user]);
  const canForceEmailUpdate: boolean = useMemo(() => !!user?.canForceUpdateEmail, [user]);
  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  const debugDialog = useDialog();

  return (
    <>
      <JsonDialog title="User Mutate Form" dialog={debugDialog} data={formState} />
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
            {canForceVerify && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-start" alignItems="between" textAlign="center">
                  <Typography className="centered" component="span" variant="body2">
                    Verified
                  </Typography>
                  <Switch
                    color="primary"
                    checked={!!formState.verified}
                    onChange={handleVerifiedChanged}
                    name="verified"
                    inputProps={{ 'aria-label': 'auto save' }}
                  />
                </Box>
              </Grid>
            )}
            {(!user || canUpdate) && (
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
            )}
            {(!user || canForceEmailUpdate) && (
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
            )}
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
                <ExceptionButton exception={error} />
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
              <BugReportIcon />
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
}));
