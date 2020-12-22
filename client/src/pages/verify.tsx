import {
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, } from 'react';
import { useMutation } from 'react-query';
import { ApiException } from '../backend-api/api.exception';
import { WithApi } from '../components-hoc/with-api/with-api.hoc';
import { ExceptionButton } from '../components/exception-button/exception-button.helper';
import { ConsumeVerificationTokenMutation } from '../generated/graphql';
import { $DANGER } from '../types/$danger.type';


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IVerifyEmailPageProps {
  //
}

/**
 * Page
 *
 * @param props
 */
const VerifyPage = WithApi<IVerifyEmailPageProps>((props) => {
  const { api, me } = props;
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar, } = useSnackbar();

  const [doSubmit, submitState] = useMutation<ConsumeVerificationTokenMutation, ApiException>(
    async () => {
      const result = await api.consumeVerificationToken({ token: router.query['token'] as $DANGER<string> });
      return result;
    }, {
      onError: (reason) => {
        enqueueSnackbar(`Errored: ${reason.message}`, { variant: 'error' });
      },
      onSuccess: () => {
        enqueueSnackbar(`Your account has been verified`, { variant: 'success' });
        router.replace('/');
      },
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
          <Grid container spacing={2}>
            <Grid className="centered" item xs={12}>
              <Typography variant="h1" component="h1">
                Verifying Email address...
              </Typography>
            </Grid>
            {(isLoading || isSuccess) && (
              <Grid className="centered" item xs={12}>
                <CircularProgress className="centered" />
              </Grid>
            )}
            {isLoading && (
              <Grid className="centered" item xs={12}>
                <Typography>
                  Verifying...
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

export default VerifyPage;