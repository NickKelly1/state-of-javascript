import { GraphQLClient } from "graphql-request";
import { _header_shad_id_key, _ls_shad_id_key } from "../constants/shad-id.const";
import { GA, GAEventCategory, PublicEnv } from "../env/public-env.helper";
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

  // update GA when authentication details change...
  if (GA) {
    const ga = GA;
    event.authenticated.on((me) => {
      if (me.user) { ga.set({ user_id: me.user.id, user_name: me.user.name, }); }
      else { ga.set({ user_id: null, user_name: null, }); }
    })
    event.unauthenticated.on((me) => {
      if (me.user) { ga.set({ user_id: me.user.id, user_name: me.user.name, }); }
      else { ga.set({ user_id: null, user_name: null, }); }
    })
    event.accept_welcome_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'accept_welcome_fail' }))
    event.accept_welcome_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'accept_welcome_start' }))
    event.accept_welcome_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'accept_welcome_success' }))
    event.authenticated.on(() => ga.event({ category: GAEventCategory.authentication, action: 'authenticated' }))
    event.force_out_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'force_out_fail' }))
    event.force_out_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'force_out_start' }))
    event.force_out_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'force_out_success' }))
    event.log_in_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'log_in_fail' }))
    event.log_in_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'log_in_start' }))
    event.log_in_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'log_in_success' }))
    event.log_out_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'log_out_fail' }))
    event.log_out_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'log_out_start' }))
    event.log_out_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'log_out_success' }))
    event.refresh_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'refresh_fail' }))
    event.refresh_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'refresh_start' }))
    event.refresh_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'refresh_success' }))
    event.register_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'register_fail' }))
    event.register_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'register_start' }))
    event.register_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'register_success' }))
    event.reset_password_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'reset_password_fail' }))
    event.reset_password_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'reset_password_start' }))
    event.reset_password_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'reset_password_success' }))
    event.unauthenticated.on(() => ga.event({ category: GAEventCategory.authentication, action: 'unauthenticated' }))
    event.verify_email_change_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'verify_email_change_fail' }))
    event.verify_email_change_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'verify_email_change_start' }))
    event.verify_email_change_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'verify_email_change_success' }))
    event.verify_email_fail.on(() => ga.event({ category: GAEventCategory.authentication, action: 'verify_email_fail' }))
    event.verify_email_change_start.on(() => ga.event({ category: GAEventCategory.authentication, action: 'verify_email_change_start' }))
    event.verify_email_success.on(() => ga.event({ category: GAEventCategory.authentication, action: 'verify_email_success' }))
  }


  const shadow_id = me.shadow_id;
  const credentialedGqlClient = new GraphQLClient(`${arg.publicEnv.API_URL}/v1/gql`, {
    fetch: isoFetch,
    credentials: 'include',
    mode: 'cors',
  });

  const uncredentialedGqlClient = new GraphQLClient(`${arg.publicEnv.API_URL}/v1/gql`, {
    fetch: isoFetch,
    credentials: 'omit',
    mode: 'cors',
  });

  const refreshGqlClient = new GraphQLClient(`${arg.publicEnv.API_URL}/refresh/v1/gql`, {
    fetch: isoFetch,
    credentials: 'include',
    mode: 'cors',
  });

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