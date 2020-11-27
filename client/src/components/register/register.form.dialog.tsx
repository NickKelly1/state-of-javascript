import {
  Box,
  Button,
  Grid,
  Input,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  Typography,
  FormHelperText,
  CircularProgress, 
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import React, { useCallback, useContext, useState } from "react";
import { useMutation } from "react-query";
import { ApiException } from "../../backend-api/api.exception";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";
import { ApiContext } from "../../components-contexts/api.context";
import { change } from "../../helpers/change.helper";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { OrPromise } from "../../types/or-promise.type";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { useDialog } from "../../hooks/use-dialog.hook";
import { DebugJsonDialog } from "../debug-json-dialog/debug-json-dialog";
import { RegisterMutation } from "../../generated/graphql";


export interface IRegisterFormDialogProps extends IWithDialogueProps {
  onSuccess: (result: RegisterMutation) => OrPromise<any>;
}

export const RegisterFormDialog = WithDialogue<IRegisterFormDialogProps>({ fullWidth: true })((props) => {
  const { dialog, onSuccess, } = props;
  const { api } = useContext(ApiContext);

  interface IFormState { name: string; email: string; password: string; };
  const [ formState, setFormState ] = useState<IFormState>({ name: '', email: '', password: '', });
  const [ doSubmit, submitState ] = useMutation<RegisterMutation, ApiException>(
    async (): Promise<RegisterMutation> => {
      const { name, email, password } = formState;
      const result = await api.register({ name, email, password })
      return result;
    },
    { onSuccess, },
  );
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const handleNameChange = useCallback(change(setFormState, 'name'), [setFormState]);
  const handleEmailChange = useCallback(change(setFormState, 'email'), [setFormState]);
  const handlePasswordChange = useCallback(change(setFormState, 'password'), [setFormState]);
  const error = submitState.error;
  const isDisabled = submitState.isLoading || submitState.isSuccess;

  const debugDialog = useDialog();

  return (
    <>
      <DebugJsonDialog title="Register Form" dialog={debugDialog} data={formState} />
      <DialogTitle>Register</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="name"
                autoFocus
                fullWidth
                margin="dense"
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
                fullWidth
                margin="dense"
                disabled={isDisabled}
                value={formState.email}
                error={!!error?.data?.email}
                helperText={error?.data?.email?.join('\n')}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="password"
                fullWidth
                margin="dense"
                disabled={isDisabled}
                type="password"
                value={formState.password}
                error={!!error?.data?.password}
                helperText={error?.data?.password?.join('\n')}
                onChange={handlePasswordChange}
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
                <FilledCircularProgress active={isDisabled} />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" disabled={isDisabled} onClick={dialog.doClose}>
            Close
          </Button>
          <Button color="primary" disabled={isDisabled} type="submit">
            Register
          </Button>
        </DialogActions>
      </form>
    </>
  );
});
