import React, { useCallback, useState, useEffect, useContext, } from 'react';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from "@material-ui/core";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { IApiException } from '../../backend-api/types/api.exception.interface';
import { ApiContext } from '../../components-contexts/api.context';
import { useSnackbar } from 'notistack';
import { RequestUserEmailChangeFormMutation, RequestUserEmailChangeFormMutationVariables, UserDetailRequestSendWelcomeEmailMutation, UserDetailRequestSendWelcomeEmailMutationVariables } from '../../generated/graphql';
import { gql } from 'graphql-request';
import { useMutation } from 'react-query';
import { useSubmitForm } from '../../hooks/use-submit-form.hook';
import { change } from '../../helpers/change.helper';
import BugReportIcon from '@material-ui/icons/BugReportOutlined';
import { WhenDebugMode } from '../../components-hoc/when-debug-mode/when-debug-mode';
import { DebugJsonDialog } from '../debug-json-dialog/debug-json-dialog';
import { useDialog } from '../../hooks/use-dialog.hook';
import { WithApi } from '../../components-hoc/with-api/with-api.hoc';

const requestUserEmailChangeFormMutation = gql`
mutation RequestUserEmailChangeForm(
  $user_id:Int!
  $email:String!
){
  requestEmailChange(
    dto:{
      user_id:$user_id
      email:$email
    }
  )
}
`;

export interface IRequestUserEmailChangeFormOnSuccessFn { (arg: RequestUserEmailChangeFormMutation): any }
export interface IRequestUserEmailChangeFormDialogProps extends IWithDialogueProps {
  user_id: number;
  initialEmail: string;
  onSuccess: IRequestUserEmailChangeFormOnSuccessFn;
}

export const RequestUserEmailChangeFormDialog = WithDialogue<IRequestUserEmailChangeFormDialogProps>({ fullWidth: true })(WithApi((props) => {
  const { user_id, initialEmail, dialog, onSuccess, api, me, } = props;
  const { enqueueSnackbar, } = useSnackbar();

  interface IFormState { email: string; };
  const [formState, setFormState] = useState<IFormState>({ email: initialEmail });

  const handleError = useCallback((exception: IApiException) => {
    enqueueSnackbar(`Failed to request email change: ${exception.message}`, { variant: 'error' });
  }, []);

  const handleSuccess = useCallback((arg: RequestUserEmailChangeFormMutation) => {
    enqueueSnackbar(`Visit your inbox to confirm email change`, { variant: 'success' });
    onSuccess?.(arg);
  }, [onSuccess]);

  const [doSubmit, submitState] = useMutation<RequestUserEmailChangeFormMutation, IApiException>(
    async (): Promise<RequestUserEmailChangeFormMutation> => {
      const vars: RequestUserEmailChangeFormMutationVariables = {
        user_id,
        email: formState.email,
      };
      const result = await api.gql<RequestUserEmailChangeFormMutation, RequestUserEmailChangeFormMutationVariables>(
        requestUserEmailChangeFormMutation,
        vars,
      );
      return result;
    },
    {
      onError: handleError,
      onSuccess: handleSuccess,
    },
  );
  const handleEmailChange = useCallback(change(setFormState, 'email'), [setFormState]);
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);

  const error = submitState.error;
  const isDisabled = submitState.isLoading;

  const debugDialog = useDialog();

  return (
    <>
      <DebugJsonDialog title="Request User Email Change Form" dialog={debugDialog} data={formState} />
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