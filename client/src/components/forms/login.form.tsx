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
} from "@material-ui/core";
import clsx from 'clsx';
import { gql } from "graphql-request";
import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import { IAuthenticationRo } from "../../backend-api/api.credentials";
import { normaliseApiException, rethrow } from "../../backend-api/normalise-api-exception.helper";
import { IApiException } from "../../backend-api/types/api.exception.interface";
import { ApiContext } from "../../contexts/api.context";
import { OrPromise } from "../../types/or-promise.type";

const useStyles = makeStyles((theme) => ({
  label: {
    paddingBottom: theme.spacing(1),
  },
  group: {
    marginBottom: theme.spacing(2),
  },
  text: {
    //
  },
}));


export interface ILoginFormProps {
  title?: string;
  onSuccess: (result: IAuthenticationRo) => OrPromise<any>;
}


export function LoginForm(props: ILoginFormProps) {
  const { title, onSuccess, } = props;
  const { api, me } = useContext(ApiContext);

  const classes = useStyles();


  interface ILoginVars { name: string; password: string; };
  const [doLogin, result] = useMutation<IAuthenticationRo, IApiException, ILoginVars>(
    async (arg: ILoginVars): Promise<IAuthenticationRo> => {
      const { name, password } = arg;
      const result = await api
        .credentials
        .signIn({ name, password })
        .catch(rethrow(normaliseApiException));
      return result;
    },
    { onSuccess, },
  );

  const [
    signupData,
    setSignupData
  ] = useState({
    name: '',
    password: '',
  });

  const error = result.error;
  const isDisabled = result.isLoading || result.isSuccess;

  return (
    <Grid container spacing={2} className="centered col">
      {title && (
        <Grid item xs={12}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <form onSubmit={(evt) => {
          evt.preventDefault();
          doLogin(signupData);
        }}>
          <Grid className="centered col" container spacing={2}>
            <Grid className={clsx(undefined, classes.group)} item xs={12} sm={12}>
              <InputLabel className={classes.label} htmlFor="signup_name">name</InputLabel>
              {/* <Input */}
              <TextField
                id="signup_name"
                disabled={isDisabled}
                inputProps={{ className: classes.text }}
                value={signupData.name}
                error={!!error?.data?.name}
                helperText={error?.data?.name?.join('\n')}
                onChange={(evt) => {
                  const value = evt.target.value;
                  setSignupData((prev) => ({ ...prev, name: value }))
                }}
              />
            </Grid>
            <Grid className={clsx(undefined, classes.group)} item xs={12} sm={12}>
              <InputLabel className={classes.label} htmlFor="signup_password">password</InputLabel>
              {/* <Input */}
              <TextField
                id="signup_password"
                disabled={isDisabled}
                inputProps={{ className: classes.text }}
                type="password"
                value={signupData.password}
                error={!!error?.data?.password}
                helperText={error?.data?.password?.join('\n')}
                onChange={(evt) => {
                  const value = evt.target.value;
                  setSignupData((prev) => ({ ...prev, password: value }))
                }}
              />
            </Grid>
            <Grid className="centered col" item xs={12} sm={12}>
              <Button disabled={isDisabled} type="submit">
                Login
              </Button>
            </Grid>
            {error && (
              <Grid className="centered col" item xs={12} sm={12}>
                <FormHelperText error>
                  {error.message}
                </FormHelperText>
              </Grid>
            )}
            {isDisabled && (
              <Grid className="centered col" item xs={12} sm={12}>
                <CircularProgress />
              </Grid>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

