import { Grid } from "@material-ui/core";
import React from "react";
import { GoogleOAuth2Connector } from "../../components/google-oauth2-connector/google-oauth2-connector";
import { serverSidePropsHandler } from "../../helpers/server-side-props-handler.helper";

interface IIntegrationsPageProps {
  //
}

function IntegrationsPage(props: IIntegrationsPageProps) {
  //
  return (
    <Grid container>
      <Grid item xs={12}>
        <GoogleOAuth2Connector />
      </Grid>
    </Grid>
  );
}

export const serverSideProps = serverSidePropsHandler<IIntegrationsPageProps>(async ({ ctx, cms, npmsApi, api }) => {
  const props: IIntegrationsPageProps = {
    //
  };

  return {
    props,
  };
});

export default IntegrationsPage;