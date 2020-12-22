import React, { useCallback, useState, } from 'react';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from "@material-ui/core";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { ApiContext } from '../../components-contexts/api.context';
import { useSnackbar } from 'notistack';
import {
  RequestEmailChangeEmailMutation,
  RequestEmailChangeEmailMutationVariables,
} from '../../generated/graphql';
import { gql } from 'graphql-request';
import { useMutation } from 'react-query';
import { useSubmitForm } from '../../hooks/use-submit-form.hook';
import { change } from '../../helpers/change.helper';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import { WhenDebugMode } from '../../components-hoc/when-debug-mode/when-debug-mode';
import { JsonDialog } from '../debug-json-dialog/json-dialog';
import { useDialog } from '../../hooks/use-dialog.hook';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';


export interface IRequestUserEmailChangeFormOnSuccessFn { (arg: RequestEmailChangeEmailMutation): any }
export interface IRequestUserEmailChangeFormDialogProps extends IWithDialogueProps {
  user_id: number;
  initialEmail: string;
  onSuccess: IRequestUserEmailChangeFormOnSuccessFn;
}

export const RequestUserEmailChangeFormDialog = WithDialogue<IRequestUserEmailChangeFormDialogProps>({ fullWidth: true })(WithApi((props) => {
  const { user_id, initialEmail, dialog, onSuccess, api, me, } = props;
  const { enqueueSnackbar, } = useSnackbar();

  interface IFormState { email: string; }
  const [formState, setFormState] = useState<IFormState>({ email: initialEmail });

  const [doSubmit, submitState] = useMutation<RequestEmailChangeEmailMutation, IApiException>(
    async (): Promise<RequestEmailChangeEmailMutation> => {
      const vars: RequestEmailChangeEmailMutationVariables = {
        user_id,
        email: formState.email,
      };
      const result = await api.requestEmailChangeEmail(vars);
      return result;
    },
    {
      onError: (reason) => {
        enqueueSnackbar(`Failed to request email change: ${reason.message}`, { variant: 'error' });
      },
      onSuccess: (success) => {
        enqueueSnackbar(`Visit your inbox to confirm email change`, { variant: 'success' });
        onSuccess?.(success);
      },
    },
  );
  const handleEmailChange = useCallback(change(setFormState, 'email'), [setFormState]);
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);

  const error = submitState.error;
  const isDisabled = submitState.isLoading;

  const debugDialog = useDialog();

  return (
    <>
      <JsonDialog title="Request User Email Change Form" dialog={debugDialog} data={formState} />
      <DialogTitle>
        Request Email change
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
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
          <Button startIcon={<MailOutlineIcon />} color="primary" disabled={isDisabled} type="submit">
            Send verification email
          </Button>
        </DialogActions>
      </form>
    </>
  );
}));