import '../styles/global.css';
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import { Layout } from '../src/components/layout/layout';
import { ApiProvider } from '../src/contexts/api.context';
import { NpmsApiProvider } from '../src/contexts/npms-api.context';
import { CmsProvider } from '../src/contexts/cms.context';
import { PublicEnvProvider } from '../src/contexts/public-env.context';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>The State of JavaScript</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <PublicEnvProvider>
        <ApiProvider>
          <CmsProvider>
            <NpmsApiProvider>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Layout appProps={props} />
              </ThemeProvider>
            </NpmsApiProvider>
          </CmsProvider>
        </ApiProvider>
      </PublicEnvProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};