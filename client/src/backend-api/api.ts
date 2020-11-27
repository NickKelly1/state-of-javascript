import { RequestDocument, Variables } from "graphql-request/dist/types";
import { PublicEnv } from "../env/public-env.helper";
import { AcceptWelcomeMutation, LoginMutation, LogoutMutation, RefreshMutation, RegisterMutation, ResetPasswordMutation, VerifyEmailMutation } from "../generated/graphql";
import { ApiConnector } from "./api.connector";
import { ApiCredentials, IApiCredentialsAcceptWelcomeArg, IApiCredentialsLoginArg, IApiCredentialsRegisterArg, IApiCredentialsResetPasswordArg, IApiCredentialsVerifyEmailArg } from "./api.credentials";
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
   * Do Logout
   *
   * @throws ApiException
   */
  logout(): Promise<LogoutMutation> {
    return this.credentials.logout().catch(rethrow(normaliseApiException));
  }

  /**
   * Do Register
   *
   * @throws ApiException
   */
  register(arg: IApiCredentialsRegisterArg): Promise<RegisterMutation> {
    return this.credentials.register(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Do Verify Email
   *
   * @throws ApiException
   */
  verifyEmail(arg: IApiCredentialsVerifyEmailArg): Promise<VerifyEmailMutation> {
    return this.credentials.verifyEmail(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Do Reset Password
   *
   * @throws ApiException
   */
  resetPassword(arg: IApiCredentialsResetPasswordArg): Promise<ResetPasswordMutation> {
    return this.credentials.resetPassword(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Accept Welcome
   *
   * @throws ApiException
   */
  acceptWelcome(arg: IApiCredentialsAcceptWelcomeArg): Promise<AcceptWelcomeMutation> {
    return this.credentials.acceptWelcome(arg).catch(rethrow(normaliseApiException));
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
