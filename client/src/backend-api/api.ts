import { RequestDocument, Variables } from "graphql-request/dist/types";
import { PublicEnv } from "../env/public-env.helper";
import {
  ConsumeEmailChangeVerificationMutation,
  ConsumeUserWelcomeMutation,
  LoginMutation,
  LogoutMutation,
  RefreshMutation,
  RegisterMutation,
  ConsumeResetPasswordMutation,
  ConsumeEmailVerificationMutation,
  AuthorisedActionsFieldsFragment,
} from "../generated/graphql";
import { ApiConnector } from "./api.connector";
import { ApiCredentials,
  IApiCredentialsConsumeChangeVerificationArg,
  IApiCredentialsConsumeUserWelcomeArg,
  IApiCredentialsLoginArg,
  IApiCredentialsRegisterArg,
  IApiCredentialsResetPasswordArg,
  IApiCredentialsVerifyEmailArg,
} from "./api.credentials";
import { IApiEvents } from "./api.events";
import { IApiMe } from "./api.me";
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
   * Check actions I can take
   *
   * @throws ApiException
   */
  actions(): Promise<AuthorisedActionsFieldsFragment> {
    return this.credentials.actions().catch(rethrow(normaliseApiException));
  }

  /**
   * Do login
   *
   * @throws ApiException
   */
  login(arg: IApiCredentialsLoginArg): Promise<LoginMutation> {
    return this.credentials.login(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Do login
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
  logout(): Promise<AuthorisedActionsFieldsFragment> {
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
   * Consume an EmailVerification Token
   *
   * @throws ApiException
   */
  consumeEmailVerification(arg: IApiCredentialsVerifyEmailArg): Promise<ConsumeEmailVerificationMutation> {
    return this.credentials.consumeEmailVerification(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Consume a ResetPassword Token
   *
   * @throws ApiException
   */
  consumeResetPassword(arg: IApiCredentialsResetPasswordArg): Promise<ConsumeResetPasswordMutation> {
    return this.credentials.consumeResetPassword(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Consume a UserWelcome Token
   *
   * @throws ApiException
   */
  consumeUserWelcome(arg: IApiCredentialsConsumeUserWelcomeArg): Promise<ConsumeUserWelcomeMutation> {
    return this.credentials.consumeUserWelcome(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Consume an EmailChangeVerification Token
   *
   * @throws ApiException
   */
  consumeEmailChangeVerification(arg: IApiCredentialsConsumeChangeVerificationArg): Promise<ConsumeEmailChangeVerificationMutation> {
    return this.credentials.consumeEmailChangeVerification(arg).catch(rethrow(normaliseApiException));
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
    return this.connector.graphql<T, V>(doc, vars).catch(error => {
      console.error('Failed gql request;', error);
      return rethrow(normaliseApiException)(error);
    });
  }


  /**
   * Get Me
   */
  get me(): IApiMe {
    return this.credentials.me;
  }


  /**
   * Get Safe me (once credentials are settled)
   *
   * @throws ApiException
   */
  safeMe(): Promise<IApiMe> {
    return this.credentials.getSafeMe().catch(rethrow(normaliseApiException));
  }
}
