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
import React, { MouseEventHandler, useCallback, useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { IAuthenticationRo } from "../../backend-api/api.credentials";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { ApiContext } from "../../components-contexts/api.context";
import { useFormStyles } from "../../hooks/use-form-styles.hook";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { change } from "../../helpers/change.helper";
import { ApiException } from "../../backend-api/api.exception";
import { useSubmitForm } from "../../hooks/use-submit-form.hook";
import { IWithDialogueProps, WithDialogue } from "../../components-hoc/with-dialog/with-dialog";


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

  interface IFormState { name_or_email: string; password: string; };
  const [ formState, setFormState ] = useState<IFormState>({ name_or_email: '', password: '', });
  const [ doSubmit, submitState ] = useMutation<IAuthenticationRo, ApiException>(
    async (): Promise<IAuthenticationRo> => {
      const { name_or_email, password } = formState;
      const result = await api
        .credentials
        .signIn({ name_or_email, password })
        .catch(rethrow(normaliseApiException));
      return result;
    },
    { onSuccess, },
  );
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);
  const handleNameOrEmail = useCallback(change(setFormState, 'name_or_email'), [setFormState]);
  const handlePasswordChange = useCallback(change(setFormState, 'password'), [setFormState]);

  const error = submitState.error;
  const isDisabled = submitState.isLoading || submitState.isSuccess;

  return (
    <>
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
          <Button disabled={isDisabled} color="primary" type="submit">
            Login
          </Button>
        </DialogActions>
      </form>
    </>
  );
});