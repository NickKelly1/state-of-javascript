import {
  Button,
  Grid,
  makeStyles,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { useMutation } from "react-query";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { change } from "../../helpers/change.helper";
import { ApiException } from "../../backend-api/api.exception";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { WhenDebugMode } from "../../components-hoc/when-debug-mode/when-debug-mode";
import BugReportIcon from "@material-ui/icons/BugReportOutlined";
import { JsonDialog } from "../debug-json-dialog/json-dialog";
import { useDialog } from "../../hooks/use-dialog.hook";
import { RequestPasswordResetDialog } from "../forgotten-password-reset-dialog/password-reset-dialog";
import { LoginMutation } from "../../generated/graphql";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { ExceptionButton } from "../exception-button/exception-button.helper";


const useStyles = makeStyles((theme) => ({
  root: {
    //
  },
}));


interface IILoginFormContentProps extends IWithDialogueProps {
  onSuccess: (success: LoginMutation) => any;
}

export const LoginFormDialog = WithDialogue<IILoginFormContentProps>({ fullWidth: true })(WithApi((props) => {
  const { onSuccess, dialog, api, me, } = props;

  interface IFormState { name_or_email: string; password: string; }
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
      <JsonDialog title="Login Form" dialog={debugDialog} data={formState} />
      <RequestPasswordResetDialog onSuccess={forgottenPasswordDialog.doClose} initialEmail={formState.name_or_email} dialog={forgottenPasswordDialog} />
      <DialogTitle>Login</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="name"
                margin="dense"
                autoComplete="email"
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
                autoComplete="password"
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
                <ExceptionButton exception={error} />
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
              <BugReportIcon />
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
}));
