import * as TS from 'io-ts';

// credentials
export const TGoogleCredentials = TS.type({
  installed: TS.type({
    client_id: TS.string,
    project_id: TS.string,
    auth_uri: TS.string,
    token_uri: TS.string,
    auth_provider_x509_cert_url: TS.string,
    client_secret: TS.string,
    redirect_uris: TS.array(TS.string),
  }),
});
export type TGoogleCredentials = TS.TypeOf<typeof TGoogleCredentials>