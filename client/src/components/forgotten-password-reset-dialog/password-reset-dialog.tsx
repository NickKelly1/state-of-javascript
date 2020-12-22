import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import { BugReport, MailOutline } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { WhenDebugMode } from "../../components-hoc/when-debug-mode/when-debug-mode";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { RequestPasswordResetEmailMutation, RequestPasswordResetEmailMutationVariables } from "../../generated/graphql";
import { change } from "../../helpers/change.helper";
import { isEmail } from "../../helpers/is-email.helper";
import { useDialog } from "../../hooks/use-dialog.hook";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { JsonDialog } from "../debug-json-dialog/json-dialog";

export type IRequestPasswordResetDialogOnSuccessFnArg = RequestPasswordResetEmailMutation;
export interface IRequestPasswordResetDialogOnSuccessFn { (arg: IRequestPasswordResetDialogOnSuccessFnArg):  any }
export interface IRequestPasswordResetDialogProps {
  initialEmail: string;
  onSuccess?: IRequestPasswordResetDialogOnSuccessFn;
}

export const RequestPasswordResetDialog = WithDialogue<IRequestPasswordResetDialogProps>({ fullWidth: true })(WithApi((props) => {
  const { dialog, initialEmail, onSuccess, api, } = props;
  const { enqueueSnackbar, } = useSnackbar();

  interface IFormState { email: string }
  const [formState, setFormState] = useState<IFormState>(() => ({ email: isEmail(initialEmail) ? initialEmail : '' }));

  const [doSubmit, submitState] = useMutation<RequestPasswordResetEmailMutation, IApiException>(
    async (): Promise<RequestPasswordResetEmailMutation> => {
      const vars: RequestPasswordResetEmailMutationVariables = {
        email: formState.email,
      };
      const result = await api.requestPasswordResetEmail(vars);
      return result;
    },
    {
      onError: (reason) => {
        enqueueSnackbar(`Failed to Reset Password: ${reason.message}`, { variant: 'error' });
      },
      onSuccess: (success) => {
        enqueueSnackbar(`A Password Reset has been sent to your email address`, { variant: 'success' });
        onSuccess?.(success);
      },
    },
  );

  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const handleChangeEmail = useCallback(change(setFormState, 'email'), [setFormState]);

  const isDisabled = submitState.isLoading;
  const error = submitState.error;

  const debugDialog = useDialog();

  return (
    <>
      <JsonDialog title="Password Reset Form" dialog={debugDialog} data={formState} />
      <DialogTitle>
        Reset Password
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
              label="email"
                fullWidth
                margin="dense"
                type="email"
                disabled={isDisabled}
                value={formState.email}
                error={!!error?.data?.email}
                helperText={error?.data?.email?.join('\n')}
                onChange={handleChangeEmail}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <WhenDebugMode>
            <IconButton color="primary" onClick={debugDialog.doToggle}>
              <BugReport />
            </IconButton>
          </WhenDebugMode>
          <Button disabled={isDisabled} color="primary" onClick={dialog.doClose}>
            Cancel
          </Button>
          <Button startIcon={<MailOutline />} disabled={isDisabled} color="primary" type="submit">
            Send Password Reset Email
          </Button>
        </DialogActions>
      </form>
    </>
  );
}));