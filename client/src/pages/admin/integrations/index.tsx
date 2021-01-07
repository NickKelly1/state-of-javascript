import { Grid } from "@material-ui/core";
import React from "react";
import { GoogleOAuth2Connector } from "../../../components/google-oauth2-connector/google-oauth2-connector";
import { serverSidePropsHandler } from "../../../helpers/server-side-props-handler.helper";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IIntegrationsPageProps {
  //
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function IntegrationsPage(props: IIntegrationsPageProps): JSX.Element {
  //
  return (
    <Grid container>
      <Grid item xs={12}>
        <GoogleOAuth2Connector />
      </Grid>
    </Grid>
  );
}

export const serverSideProps = serverSidePropsHandler<IIntegrationsPageProps>(async () => {
  const props: IIntegrationsPageProps = {
    //
  };

  return {
    props,
  };
});

export default IntegrationsPage;