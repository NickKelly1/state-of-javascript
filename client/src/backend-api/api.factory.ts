import { GraphQLClient } from "graphql-request";
import { shad_id } from "../constants/shad-id.const";
import { PublicEnv } from "../env/public-env.helper";
import { isoFetch } from "../iso-fetch";
import { Api } from "./api";
import { ApiConnector } from "./api.connector";
import { ApiCredentials, ApiCredentialsFactory, ApiCredentialsFactoryArgType } from "./api.credentials";
import { ApiEventsFactory, IApiEvents } from "./api.events";
import { ApiMe } from "./api.me";

export enum ApiFactoryArgType {
  WithMe,
  WithCredentials,
  WithoutCredentials,
}

type IApiFactoryArgWithMe = { type: ApiFactoryArgType.WithMe; me: ApiMe; publicEnv: PublicEnv; }
type IApiFactoryArgWithCredentials = { type: ApiFactoryArgType.WithCredentials; me: undefined; publicEnv: PublicEnv; }
type IApiFactoryArgWithoutCredentials = { type: ApiFactoryArgType.WithoutCredentials; me: undefined; publicEnv: PublicEnv; }

type IApiFactoryArg =
  | IApiFactoryArgWithMe
  | IApiFactoryArgWithCredentials
  | IApiFactoryArgWithoutCredentials;

/**
 * Create an Api instance
 *
 * @param arg
 */
export function ApiFactory(arg: IApiFactoryArgWithMe): Api
export function ApiFactory(arg: IApiFactoryArgWithCredentials): Promise<Api>
export function ApiFactory(arg: IApiFactoryArgWithoutCredentials): Promise<Api>
export function ApiFactory(arg: IApiFactoryArg): Api | Promise<Api> {
  const event = ApiEventsFactory();

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
    // headers
  });

  switch (arg.type) {

    // with me
    case ApiFactoryArgType.WithMe: {
      const {
        me,
        publicEnv,
      } = arg;
      const credentials = ApiCredentialsFactory({
        type: ApiCredentialsFactoryArgType.WithMe,
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

    // with credentials
    case ApiFactoryArgType.WithCredentials: {
      const {
        me,
        publicEnv,
      } = arg;
      const result: Promise<Api> =  ApiCredentialsFactory({
        type: ApiCredentialsFactoryArgType.WithCredentials,
        me,
        credentialedGqlClient,
        event,
        refreshGqlClient,
        uncredentialedGqlClient,
        publicEnv,
      })
        .then(credentials => {
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
        });

      return result;
    }

    // without credentials
    case ApiFactoryArgType.WithoutCredentials: {
      const {
        me,
        publicEnv,
      } = arg;
      const result: Promise<Api> = ApiCredentialsFactory({
          type: ApiCredentialsFactoryArgType.WithoutCredentials,
          me,
          credentialedGqlClient,
          event,
          refreshGqlClient,
          uncredentialedGqlClient,
          publicEnv,
        })
        .then(credentials => {
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
        });

      return result;
    }

    default: {
      // @ts-expect-error
      throw new Error(`Unhandled type "${(arg).type}"`);
    }
  }
}