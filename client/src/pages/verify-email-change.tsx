import { CircularProgress, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { ApiException } from '../backend-api/api.exception';
import { WithApi } from '../components-hoc/with-api/with-api.hoc';
import { ExceptionButton } from '../components/exception-button/exception-button.helper';
import { ConsumeEmailChangeVerificationMutation, } from '../generated/graphql';
import { $DANGER } from '../types/$danger.type';


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IVerifyEmailChangePageProps {
  //
}

/**
 * Page
 *
 * @param props
 */
const VerifyEmailChangePage = WithApi<IVerifyEmailChangePageProps>((props) => {
  const { api, me } = props;
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar, } = useSnackbar();

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IState {}
  const [state, setState] = useState<IState>({});

  const handleSuccess = useCallback((result: ConsumeEmailChangeVerificationMutation) => {
    enqueueSnackbar(`Your email has been updated`, { variant: 'success' });
    router.replace('/');
  }, []);
  const handleError = useCallback((exception: ApiException) => {
    enqueueSnackbar(`Errored: ${exception.message}`, { variant: 'error' });
  }, []);

  const [doSubmit, submitState] = useMutation<ConsumeEmailChangeVerificationMutation, ApiException>(
    async () => {
      const result = await api.consumeEmailChangeVerification({ token: router.query['token'] as $DANGER<string> });
      return result;
    }, {
      onSuccess: handleSuccess,
      onError: handleError,
    }
  );

  useEffect(() => {
    if (process.browser) {
      // in browser - fire verification
      doSubmit();
    }
  }, []);

  const isLoading = submitState.isLoading;
  const error = submitState.error;
  const isSuccess = submitState.isSuccess

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid item xs={12}>
            {/*  */}
          </Grid>
          <Grid container spacing={2}>
            {(isLoading || isSuccess) && (
              <Grid className="centered" item xs={12}>
                <CircularProgress className="centered" />
              </Grid>
            )}
            {isLoading && (
              <Grid className="centered" item xs={12}>
                <Typography>
                  Updating email address...
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
              <Grid item xs={12}>
                <ExceptionButton exception={error} />
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
});

export default VerifyEmailChangePage;