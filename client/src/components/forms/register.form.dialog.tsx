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
  DialogActions} from "@material-ui/core";
import clsx from 'clsx';
import { gql } from "graphql-request";
import React, { MouseEventHandler, useCallback, useContext, useState } from "react";
import { useMutation } from "react-query";
import { IAuthenticationRo } from "../../backend-api/api.credentials";
import { ApiException } from "../../backend-api/api.exception";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { ApiContext } from "../../contexts/api.context";
import { change } from "../../helpers/change.helper";
import { useFormStyles } from "../../hooks/use-form-styles.hook";
import { OrPromise } from "../../types/or-promise.type";
import { FilledCircularProgress } from "../filled-circular-progress/filled-circular-progress";
import { IWithDialogueProps, WithDialogue } from "../with-dialog/with-dialog";


export interface IRegisterFormDialogProps extends IWithDialogueProps {
  onSuccess: (result: IAuthenticationRo) => OrPromise<any>;
}

export const RegisterFormDialog = WithDialogue<IRegisterFormDialogProps>({ fullWidth: true })((props) => {
  const { dialog, onSuccess, } = props;
  const { api } = useContext(ApiContext);

  interface IFormState { name: string; password: string };
  const [ formState, setFormState ] = useState<IFormState>({ name: '', password: '', });
  const [ doSubmit, submitState ] = useMutation<IAuthenticationRo, ApiException>(
    async (): Promise<IAuthenticationRo> => {
      const { name, password } = formState;
      const result = await api
        .credentials
        .signUp({ name, password })
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
      <DialogTitle>Register</DialogTitle>
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
        <Button color="primary" disabled={isDisabled} onClick={handleSubmit}>
          Register
        </Button>
      </DialogActions>
    </>
  );
});
