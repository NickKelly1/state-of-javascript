import { Box, Button, Grid, Input, InputLabel, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import { useRouter } from 'next/router';
import React, { useCallback, useContext, } from "react";
import { LoginForm } from "../components/forms/login.form";
import { ApiContext } from "../contexts/api.context";
import { serverSidePropsHandler } from "../helpers/server-side-props-handler.helper";

interface ILoginPageProps {
  //
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
}));

function LoginPage(props: ILoginPageProps) {
  const { api, me } = useContext(ApiContext);

  const classes = useStyles();
  const router = useRouter();
  const onSuccess = useCallback(() => { router.push('/'); }, [router]);

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12} md={6} lg={3}>
        <LoginForm onSuccess={onSuccess} title="Login" />
      </Grid>
    </Grid>
  );
}

export const getServerSideProps = serverSidePropsHandler<ILoginPageProps>(async ({ ctx, cms, npmsApi, api, }) => {


  return {
    props: {
      //
    },
  }
});

export default LoginPage;