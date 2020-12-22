import { gql } from "graphql-request";
import { RequestDocument, Variables } from "graphql-request/dist/types";
import { PublicEnv } from "../env/public-env.helper";
import {
  LoginMutation,
  RefreshMutation,
  RegisterMutation,
  AuthorisedActionsFieldsFragment,
  ConsumePasswordResetTokenMutation,
  ConsumeWelcomeTokenMutation,
  ConsumeEmailChangeTokenMutation,
  RequestPasswordResetEmailMutation,
  RequestPasswordResetEmailMutationVariables,
  RequestVerificationEmailMutationVariables,
  RequestVerificationEmailMutation,
  ConsumeVerificationTokenMutationVariables,
  ConsumeVerificationTokenMutation,
  RequestWelcomeEmailMutationVariables,
  RequestWelcomeEmailMutation,
  RequestEmailChangeEmailMutation,
  RequestEmailChangeEmailMutationVariables,
} from "../generated/graphql";
import { ApiConnector } from "./api.connector";
import { ApiCredentials,
  IApiCredentialsConsumeChangeVerificationArg,
  IApiCredentialsConsumeUserWelcomeArg,
  IApiCredentialsLoginArg,
  IApiCredentialsRegisterArg,
  IApiCredentialsResetPasswordArg,
} from "./api.credentials";
import { IApiEvents } from "./api.events";
import { IApiMe } from "./api.me";
import { normaliseApiException, rethrow } from "./normalise-api-exception.helper";


/**
 * Request a PasswordResetEmail
 */
const requestPasswordResetEmail = gql`
mutation RequestPasswordResetEmail(
  $email:String!
){
  requestPasswordResetEmail(
    dto:{
      email:$email
    }
  )
}
`;


/**
 * Request a VerificationEmail
 */
const requestVerificationEmailMutation = gql`
mutation RequestVerificationEmail(
  $id:Int!
){
  requestVerificationEmail(
    dto:{
      user_id:$id
    }
  )
}
`;


/**
 * Request a WelcomeEmail
 */
const requestWelcomeEmailMutation = gql`
mutation RequestWelcomeEmail(
  $id:Int!
){
  requestWelcomeEmail(
    dto:{
      user_id:$id
    }
  )
}
`;


/**
 * Request an EmailChangeEmail
 */
const requestEmailChangeEmailMutation = gql`
mutation RequestEmailChangeEmail(
  $user_id:Int!
  $email:String!
){
  requestEmailChangeEmail(
    dto:{
      user_id:$user_id
      email:$email
    }
  )
}
`;

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
   * Refresh credentials
   *
   * @throws ApiException
   */
  refresh(): Promise<RefreshMutation> {
    return this.credentials.refresh().catch(rethrow(normaliseApiException));
  }


  /**
   * Resync me (/authorisation)
   *
   * @throws ApiException
   */
  resyncMe(): Promise<AuthorisedActionsFieldsFragment> {
    return this.credentials.resyncMe().catch(rethrow(normaliseApiException));
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
   * Consume an VerificationToken
   *
   * @throws ApiException
   */
  consumeVerificationToken(vars: ConsumeVerificationTokenMutationVariables): Promise<ConsumeVerificationTokenMutation> {
    return this.credentials.consumeVerificationToken(vars).catch(rethrow(normaliseApiException));
  }


  /**
   * Consume a ResetPasswordToken
   *
   * @throws ApiException
   */
  consumePasswordResetToken(arg: IApiCredentialsResetPasswordArg): Promise<ConsumePasswordResetTokenMutation> {
    return this.credentials.consumePasswordResetToken(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Consume a UserWelcomeToken
   *
   * @throws ApiException
   */
  consumeWelcomeToken(arg: IApiCredentialsConsumeUserWelcomeArg): Promise<ConsumeWelcomeTokenMutation> {
    return this.credentials.consumeWelcomeToken(arg).catch(rethrow(normaliseApiException));
  }


  /**
   * Consume an EmailChangeVerificationToken
   *
   * @throws ApiException
   */
  consumeEmailChangeToken(arg: IApiCredentialsConsumeChangeVerificationArg): Promise<ConsumeEmailChangeTokenMutation> {
    return this.credentials.consumeEmailChangeToken(arg).catch(rethrow(normaliseApiException));
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


  /**
   * Request a PasswordResetEmail
   */
  async requestPasswordResetEmail(vars: RequestPasswordResetEmailMutationVariables): Promise<RequestPasswordResetEmailMutation> {
    return this
      .gql<RequestPasswordResetEmailMutation, RequestPasswordResetEmailMutationVariables>(
        requestPasswordResetEmail,
        vars,
      )
      .catch(rethrow(normaliseApiException));
  }


  /**
   * Request a VerificationEmail
   */
  async requestVerificationEmail(vars: RequestVerificationEmailMutationVariables): Promise<RequestVerificationEmailMutation> {
    return this
      .gql<RequestVerificationEmailMutation, RequestVerificationEmailMutationVariables>(
        requestVerificationEmailMutation,
        vars,
      )
      .catch(rethrow(normaliseApiException));
  }


  /**
   * Request a WelcomeEmail
   */
  async requestWelcomeEmail(vars: RequestWelcomeEmailMutationVariables): Promise<RequestWelcomeEmailMutation> {
    return this
      .gql<RequestWelcomeEmailMutation, RequestWelcomeEmailMutationVariables>(
        requestWelcomeEmailMutation,
        vars,
      )
      .catch(rethrow(normaliseApiException));
  }


  /**
   * Request a EmailChangeEmail
   */
  async requestEmailChangeEmail(vars: RequestEmailChangeEmailMutationVariables): Promise<RequestEmailChangeEmailMutation> {
    return this
      .gql<RequestEmailChangeEmailMutation, RequestEmailChangeEmailMutationVariables>(
        requestEmailChangeEmailMutation,
        vars,
      )
      .catch(rethrow(normaliseApiException));
  }
}
