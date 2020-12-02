import { Button, CircularProgress, FormHelperText, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { fail } from 'assert';
import { gql } from 'graphql-request';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { Api } from '../backend-api/api';
import { ApiException } from '../backend-api/api.exception';
import { normaliseApiException, rethrow } from '../backend-api/normalise-api-exception.helper';
import { IApiException } from '../backend-api/types/api.exception.interface';
import { ApiContext } from '../components-contexts/api.context';
import { WithApi } from '../components-hoc/with-api/with-api.hoc';
import { WithLoadable } from '../components-hoc/with-loadable/with-loadable';
import {
  PasswordResetPageDataQueryVariables,
  PasswordResetPageDataQuery,
  ConsumeResetPasswordMutation,
} from '../generated/graphql';
import { Attempt, attemptAsync, isFail, isSuccess } from '../helpers/attempted.helper';
import { change } from '../helpers/change.helper';
import { ist } from '../helpers/ist.helper';
import { serverSidePropsHandler } from '../helpers/server-side-props-handler.helper';
import { useSubmitForm } from '../hooks/use-submit-form.hook';
import { OrNull } from '../types/or-null.type';


const PasswordResetPageDataQueryName = 'PasswordResetPageDataQuery';
const passwordResetPageDataQuery = gql`
query PasswordResetPageData(
  $token:String!
){
  userByToken(
    query:{
      token:$token
    }
  ){
    can{
      show
      acceptWelcome
    }
    data{
      id
      name
      deactivated
      email
      verified
      created_at
      updated_at
      deleted_at
    }
  }
}
`;


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

interface IPasswordResetPageProps {
  token: OrNull<string>;
  pageData: Attempt<PasswordResetPageDataQuery, IApiException>;
}

/**
 * Page
 *
 * @param props
 */
function PasswordResetPage(props: IPasswordResetPageProps) {
  const { token, pageData } = props;
  const classes = useStyles();

  const contentProps: OrNull<IPasswordResetPageContentsProps> = useMemo(
    () => (ist.defined(token) && isSuccess(pageData)) ? ({ data: pageData.value, token }) : null,
    [token, pageData],
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <WithLoadable
            isLoading={false}
            error={isFail(pageData) ? pageData.value : undefined}
            data={contentProps}
          >
            {(lProps) => <WelcomePageContents {...lProps} />}
          </WithLoadable>
        </Paper>
      </Grid>
    </Grid>
  );
}

interface IPasswordResetPageContentsProps {
  data: PasswordResetPageDataQuery;
  token: string;
}

/**
 * Contents of the page
 *
 * @param props
 */
const WelcomePageContents = WithApi<IPasswordResetPageContentsProps>((props) => {
  const { data, token, api, me  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  interface IFormState { name: string; password: string; }
  const [formState, setFormState] = useState<IFormState>({ name: data.userByToken.data.name, password: '', });

  const handleError = useCallback((exception: IApiException) => {
    enqueueSnackbar(`Error: ${exception.message}`, { variant: 'error' });
  }, [enqueueSnackbar]);

  const handleSuccess = useCallback((arg: ConsumeResetPasswordMutation) => {
    // success & navigate home
    const name = arg.consumeForgottenUserPasswordReset.user_name;
    enqueueSnackbar(`Welcome, ${name ?? formState.name}. Your password has been updated.`, { variant: 'success' });
    router.replace('/');
  }, [enqueueSnackbar, router, formState]);

  const [doSubmit, submitState] = useMutation<ConsumeResetPasswordMutation, IApiException>(
    async (): Promise<ConsumeResetPasswordMutation> => {
      const result = await api.consumeResetPassword({ token, password: formState.password, });
      return result;
    },
    {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  );

  const error = submitState.error;
  const isDisabled = submitState.isLoading;
  const isLoading = submitState.isLoading;
  const isSuccess = submitState.isSuccess;

  const handlePasswordChange = useCallback(change(setFormState, 'password'), [setFormState]);
  const handleSubmit = useSubmitForm(doSubmit, [doSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography className="centered" component="h1" variant="h1">
            {`Hi ${data.userByToken.data.name}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className="centered" component="h2" variant="h2">
            Set a new password
          </Typography>
        </Grid>
        <Grid className="centered" item xs={12}>
          <TextField
            label="password"
            margin="dense"
            className="text-center"
            inputProps={{ className: 'text-center' }}
            disabled={isDisabled}
            type="password"
            value={formState.password}
            error={!!error?.data?.password}
            helperText={error?.data?.password?.join('\n')}
            onChange={handlePasswordChange}
          />
        </Grid>
        <Grid className="centered col" item xs={12}>
          <Button color="primary" disabled={isDisabled} type="submit">
            Submit
          </Button>
        </Grid>
        {(isLoading || isSuccess) && (
          <Grid className="centered" item xs={12}>
            <CircularProgress className="centered" />
          </Grid>
        )}
        {isLoading && (
          <Grid className="centered" item xs={12}>
            <Typography>
              Resetting...
            </Typography>
          </Grid>
        )}
        {isSuccess && (
          <Grid className="centered" item xs={12}>
            <Typography>
              Success. Redirecting...
            </Typography>
          </Grid>
        )}
        {error && (
          <Grid className="centered" item xs={12}>
            <FormHelperText error>
              {error.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </form>
  );
  //
});


/**
 * Get the pages data
 *
 * @param arg
 */
async function getPageData(arg: { api: Api; vars: PasswordResetPageDataQueryVariables; }): Promise<Attempt<PasswordResetPageDataQuery, IApiException>> {
  const { api, vars } = arg;
  const result: Attempt<PasswordResetPageDataQuery, IApiException> = await attemptAsync(
    api.gql<PasswordResetPageDataQuery, PasswordResetPageDataQueryVariables>(
      passwordResetPageDataQuery,
      vars,
    ),
    normaliseApiException,
  );
  return result;
}

/**
 * Get props from the server
 */
export const getServerSideProps = serverSidePropsHandler(async ({ api, cms, ctx, npmsApi, publicEnv, }) => {
  const token = ctx.query['token'];

  let props: IPasswordResetPageProps;
  if (ist.nullable(token)) {
    // no token - bad!
    const message = 'No token';
    const error = 'BadRequestException';
    props = {
      token: null,
      pageData: fail(ApiException({
        code: -1,
        message,
        error,
        name: message,
      })),
    };
  } else {
    const _token = Array.isArray(token) ? token[0] : token;
    const vars: PasswordResetPageDataQueryVariables = { token: _token };
    const data = await getPageData({ api, vars });
    props = {
      token: _token,
      pageData: data,
    };
  }

  return {
    props,
  };
});


export default PasswordResetPage;