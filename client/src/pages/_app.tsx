import '../../styles/global.css';
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import { Layout } from '../components/layout/layout';
import { ApiProvider } from '../components-contexts/api.context';
import { NpmsApiProvider } from '../components-contexts/npms-api.context';
import { CmsProvider } from '../components-contexts/cms.context';
import { PublicEnvProvider } from '../components-contexts/public-env.context';
import { AppProps } from 'next/app';
import { DebugModeProvider } from '../components-contexts/debug-mode.context';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { IPageProps } from '../types/page-props.interface';

interface IMyAppProps extends AppProps {
  //
}

const queryCache = new QueryCache({
  defaultConfig: {
    //
    queries: {
      retry: 2,
      //
    },
  },
});

export default function MyApp(props: IMyAppProps) {
  const { Component, pageProps } = props;

  const { _me, ..._pageProps } = pageProps as IPageProps;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>The State of JavaScript</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <DebugModeProvider>
            <ReactQueryCacheProvider queryCache={queryCache}>
              <PublicEnvProvider>
                <ApiProvider initialMe={_me}>
                  <CmsProvider>
                    <NpmsApiProvider>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        <Layout appProps={props} />
                    </NpmsApiProvider>
                  </CmsProvider>
                </ApiProvider>
              </PublicEnvProvider>
            </ReactQueryCacheProvider>
          </DebugModeProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};