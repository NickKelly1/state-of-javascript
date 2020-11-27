import {
  Button,
  Grid,
  makeStyles,
  TextField,
  FormHelperText,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
} from "@material-ui/core";
import React, { MouseEventHandler, useCallback, useContext, useEffect, useState } from "react";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { useMutation } from "react-query";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { ApiContext } from "../../components-contexts/api.context";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { change } from "../../helpers/change.helper";
import { ApiException } from "../../backend-api/api.exception";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { WithLoadable } from "../../components-hoc/with-loadable/with-loadable";
import { WhenDebugMode } from "../../components-hoc/when-debug-mode/when-debug-mode";
import { BugReport } from "@material-ui/icons";
import { DebugJsonDialog } from "../debug-json-dialog/debug-json-dialog";
import { useDialog } from "../../hooks/use-dialog.hook";
import { ForgottenPasswordDialog } from "../forgotten-password-reset-dialog/forgotten-password-reset-dialog";
import { LoginMutation } from "../../generated/graphql";


const useStyles = makeStyles((theme) => ({
  root: {
    //
  },
}));


interface IILoginFormContentProps extends IWithDialogueProps {
  onSuccess: (result: LoginMutation) => any;
}

export const LoginFormDialog = WithDialogue<IILoginFormContentProps>({ fullWidth: true })((props) => {
  const { onSuccess, dialog, } = props;
  const { api } = useContext(ApiContext);

  interface IFormState { name_or_email: string; password: string; };
  const [ formState, setFormState ] = useState<IFormState>({ name_or_email: '', password: '', });
  const [ doSubmit, submitState ] = useMutation<LoginMutation, ApiException>(
    async (): Promise<LoginMutation> => {
      const { name_or_email, password } = formState;
      const result = await api.login({ name_or_email, password })
      return result;
    },
    { onSuccess, },
  );
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const handleNameOrEmail = useCallback(change(setFormState, 'name_or_email'), [setFormState]);
  const handlePasswordChange = useCallback(change(setFormState, 'password'), [setFormState]);

  const error = submitState.error;
  const isDisabled = submitState.isLoading || submitState.isSuccess;

  const forgottenPasswordDialog = useDialog();
  const debugDialog = useDialog();

  return (
    <>
      <DebugJsonDialog title="Login Form" dialog={debugDialog} data={formState} />
      <ForgottenPasswordDialog onSuccess={forgottenPasswordDialog.doClose} initialEmail={formState.name_or_email} dialog={forgottenPasswordDialog} />
      <DialogTitle>Login</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="name"
                margin="dense"
                fullWidth
                autoFocus
                disabled={isDisabled}
                value={formState.name_or_email}
                error={!!error?.data?.name_or_email}
                helperText={error?.data?.name_or_email?.join('\n')}
                onChange={handleNameOrEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="password"
                margin="dense"
                fullWidth
                type="password"
                disabled={isDisabled}
                value={formState.password}
                error={!!error?.data?.password}
                helperText={error?.data?.password?.join('\n')}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button startIcon={<LockOpenIcon />} className="text-transform-none" color="primary" onClick={forgottenPasswordDialog.doToggle}>
                I've forgotten my password
              </Button>
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
                <FilledCircularProgress active={isDisabled} />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions >
          <WhenDebugMode>
            <IconButton color="primary" onClick={debugDialog.doToggle}>
              <BugReport />
            </IconButton>
          </WhenDebugMode>
          <Button disabled={isDisabled} color="primary" onClick={dialog.doClose}>
            Cancel
          </Button>
          <Button disabled={isDisabled} color="primary" type="submit">
            Login
          </Button>
        </DialogActions>
      </form>
    </>
  );
});
