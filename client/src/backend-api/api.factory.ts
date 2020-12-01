import { GraphQLClient } from "graphql-request";
import { _header_shad_id_key, _ls_shad_id_key } from "../constants/shad-id.const";
import { PublicEnv } from "../env/public-env.helper";
import { isoFetch } from "../iso-fetch";
import { Api } from "./api";
import { ApiConnector } from "./api.connector";
import { ApiCredentials, ApiCredentialsFactory } from "./api.credentials";
import { ApiEventsFactory, IApiEvents } from "./api.events";
import { apiMeFns, IApiMe } from "./api.me";

type IApiFactoryArg = {
  me: IApiMe; publicEnv: PublicEnv;
};

/**
 * Create an Api instance
 *
 * @param arg
 */
export function ApiFactory(arg: IApiFactoryArg): Api {
  const { me, publicEnv } = arg;
  const event = ApiEventsFactory();

  const shadow_id = me.shadow_id;
  const credentialedGqlClient = new GraphQLClient(`${arg.publicEnv.API_URL}/v1/gql`, {
    fetch: isoFetch,
    credentials: 'include',
    mode: 'cors',
  });
  credentialedGqlClient.setHeader(_header_shad_id_key, shadow_id);

  const uncredentialedGqlClient = new GraphQLClient(`${arg.publicEnv.API_URL}/v1/gql`, {
    fetch: isoFetch,
    credentials: 'omit',
    mode: 'cors',
  });
  uncredentialedGqlClient.setHeader(_header_shad_id_key, shadow_id);

  const refreshGqlClient = new GraphQLClient(`${arg.publicEnv.API_URL}/refresh/v1/gql`, {
    fetch: isoFetch,
    credentials: 'include',
    mode: 'cors',
    // headers
  });
  refreshGqlClient.setHeader(_header_shad_id_key, shadow_id);

  const credentials = ApiCredentialsFactory({
    me,
    credentialedGqlClient,
    event,
    refreshGqlClient,
    uncredentialedGqlClient,
    publicEnv,
  });

  const apiConnector = new ApiConnector(
    publicEnv,
    credentials,
  );

  const api = new Api(
    publicEnv,
    apiConnector,
    credentials,
    event,
  );

  return api;
}