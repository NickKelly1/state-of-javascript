import {
  Button,
  Grid,
  makeStyles,
  TextField,
  FormHelperText,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import React, { MouseEventHandler, useCallback, useContext, useState } from "react";
import { useMutation } from "react-query";
import { IAuthenticationRo } from "../../backend-api/api.credentials";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { ApiContext } from "../../contexts/api.context";
import { useFormStyles } from "../../hooks/use-form-styles.hook";
import { IWithDialogueProps, WithDialogue } from "../with-dialog/with-dialog";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { change } from "../../helpers/change.helper";
import { ApiException } from "../../backend-api/api.exception";


const useStyles = makeStyles((theme) => ({
  root: {
    //
  },
}));


interface IILoginFormContentProps extends IWithDialogueProps {
  onSuccess: (result: IAuthenticationRo) => any;
}

export const LoginFormDialog = WithDialogue<IILoginFormContentProps>({ fullWidth: true })((props) => {
  const { onSuccess, dialog, } = props;
  const { api } = useContext(ApiContext);

  interface IFormState { name: string; password: string; };
  const [ formState, setFormState ] = useState<IFormState>({ name: '', password: '', });
  const [ doSubmit, submitState ] = useMutation<IAuthenticationRo, ApiException>(
    async (): Promise<IAuthenticationRo> => {
      const { name, password } = formState;
      const result = await api
        .credentials
        .signIn({ name, password })
        .catch(rethrow(normaliseApiException));
      return result;
    },
    { onSuccess, },
  );
  const handleSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(() => doSubmit(), [doSubmit]);
  const handleNameChange = useCallback(change(setFormState, 'name'), [setFormState]);
  const handlePasswordChange = useCallback(change(setFormState, 'password'), [setFormState]);

  const error = submitState.error;
  const isDisabled = submitState.isLoading || submitState.isSuccess;

  return (
    <>
      <DialogTitle>Login</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="name"
              id="signup_name"
              margin="dense"
              fullWidth
              autoFocus
              disabled={isDisabled}
              value={formState.name}
              error={!!error?.data?.name}
              helperText={error?.data?.name?.join('\n')}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="password"
              margin="dense"
              fullWidth
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
      <DialogActions >
        <Button disabled={isDisabled} color="primary" onClick={dialog.doClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled} color="primary" onClick={handleSubmit}>
          Login
        </Button>
      </DialogActions>
    </>
  );
});