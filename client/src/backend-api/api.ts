import { RequestDocument, Variables } from "graphql-request/dist/types";
import { PublicEnv } from "../env/public-env.helper";
import { LoginMutation, LogoutMutation, RefreshMutation } from "../generated/graphql";
import { ApiConnector } from "./api.connector";
import { ApiCredentials, IApiCredentialsLoginArg, IApiCredentialsRegisterArg } from "./api.credentials";
import { IApiEvents } from "./api.events";
import { ApiMe } from "./api.me";
import { normaliseApiException, rethrow } from "./normalise-api-exception.helper";

export class Api {
  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly connector: ApiConnector,
    protected readonly credentials: ApiCredentials,
    public readonly event: IApiEvents,
  ) {
    //
  }

  /**
   * Do login
   *
   * Guarnteed to throw ApiException
   *
   * @throws ApiException
   */
  login(arg: IApiCredentialsLoginArg): Promise<LoginMutation> {
    return this.credentials.login(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Do login
   *
   * Guarnteed to throw ApiException
   *
   * @throws ApiException
   */
  refresh(): Promise<RefreshMutation> {
    return this.credentials.refresh().catch(rethrow(normaliseApiException));
  }


  /**
   * Do logout
   *
   * Guarnteed to throw ApiException
   *
   * @throws ApiException
   */
  logout(): Promise<LogoutMutation> {
    return this.credentials.logout().catch(rethrow(normaliseApiException));
  }

  /**
   * Do register
   *
   * Guarnteed to throw ApiException
   *
   * @throws ApiException
   */
  register(arg: IApiCredentialsRegisterArg) {
    return this.credentials.register(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Send a GraphQL Request
   *
   * @param doc
   * @param vars
   *
   * @throws ApiException
   */
  gql<T = any, V = Variables>(doc: RequestDocument, vars: V): Promise<T> {
    return this.connector.graphql<T, V>(doc, vars).catch(rethrow(normaliseApiException));
  }


  /**
   * Get Me
   */
  get me(): ApiMe {
    return this.credentials.me;
  }


  /**
   * Get Safe me (once credentials are settled)
   */
  safeMe(): Promise<ApiMe> {
    return this.credentials.getSafeMe();
  }
}
