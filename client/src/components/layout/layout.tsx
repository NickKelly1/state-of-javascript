import React, { useState } from "react";
import { TopBar } from "./top-bar";
import { AppProps } from 'next/app';
import { Footer } from "./footer";
import { AppBar, Container, makeStyles, Paper, Toolbar } from "@material-ui/core";
import { WithApi } from "../../components-hoc/with-api/with-api.hoc";
import { gql } from "graphql-request";
import { UploadTestMutation, UploadTestMutationVariables } from '../../generated/graphql';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    // make content fill the full page container
    flex: '1 0 auto',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  footer: {
    top: 'auto',
    bottom: 0,
  },
  layoutToolbar: {
    paddingLeft: 0,
  },
}));

export interface ILayoutProps {
  appProps: AppProps;
}


export const Layout = WithApi<ILayoutProps>((props) => {
  const { appProps, api, me, } = props
  const { Component, pageProps } = appProps;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {/* header */}
      <AppBar position="sticky" color="inherit">
        <Container maxWidth="lg">
          <Toolbar className={classes.layoutToolbar}>
            <TopBar />
          </Toolbar>
        </Container>
      </AppBar>

      {/* content */}
      <main className={classes.content}>
        <Container maxWidth="lg">
          <Component {...pageProps} />
        </Container>
      </main>

      {/* footer  */}
      <Paper>
        <Container maxWidth="lg">
          <Toolbar className={classes.layoutToolbar}>
            <Footer />
          </Toolbar>
        </Container>
      </Paper>
    </div>
  )
});