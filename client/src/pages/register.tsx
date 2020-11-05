
import { Grid, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useCallback, useContext, } from "react";
import { RegisterForm } from "../components/forms/register.form";
import { ApiContext } from "../contexts/api.context";
import { serverSidePropsHandler } from "../helpers/server-side-props-handler.helper";

interface ISignupPageProps {
  //
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

function SignupPage(props: ISignupPageProps) {
  const { api, me } = useContext(ApiContext);

  const classes = useStyles();
  const router = useRouter();
  const onSuccess = useCallback(() => { router.push('/'); }, [router]);

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12} md={6} lg={3}>
        <Paper className={classes.paper}>
          <RegisterForm
            onSuccess={onSuccess}
            title="Register"
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps = serverSidePropsHandler<ISignupPageProps>(async ({ ctx, cms, npmsApi, api, }) => {


  return {
    props: {
      //
    },
  }
});

export default SignupPage;