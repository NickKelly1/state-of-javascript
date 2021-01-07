import { Mutex } from 'async-mutex';
import { gql, GraphQLClient, } from 'graphql-request';
import { _header_aid_key } from '../constants/aid.const';
import { Debug } from '../debug/debug';
import { PublicEnv, PublicEnvSingleton } from '../env/public-env.helper';
import {
  LoginMutation,
  LoginMutationVariables,
  LogoutMutation,
  LogoutMutationVariables,
  RefreshMutation,
  RefreshMutationVariables,
  RegisterMutationVariables,
  RegisterMutation,
  ActionsQuery,
  ActionsQueryVariables,
  AuthorisedActionsFieldsFragment,
  ConsumeEmailChangeTokenMutationVariables,
  ConsumePasswordResetTokenMutation,
  ConsumePasswordResetTokenMutationVariables,
  ConsumeWelcomeTokenMutation,
  ConsumeWelcomeTokenMutationVariables,
  ConsumeEmailChangeTokenMutation,
  ConsumeVerificationTokenMutationVariables,
  ConsumeVerificationTokenMutation,
} from '../generated/graphql';
import { isoFetch } from '../iso-fetch';
import { IApiEvents } from './api.events';
import { ApiHttpClient } from './api.http.client';
import { apiMeFns, IApiMe } from './api.me';


/**
 * AuthorisedActionsFields Fragment
 */
export const AUTHORISED_ACTIONS_FIELDS_FRAGMENT = gql`
fragment AuthorisedActionsFields on ActionsNode {
  users{ show login register create logout }
  roles{ show create }
  userRoles{ show }
  permissions{ show }
  rolePermissions{ show }
  npmsPackages{ show create }
  npmsDashboards{ show sort create }
  npmsDashboardItems{ show }
  newsArticles{ show create }
  newsArticleStatuses{ show }
  jobs{ show }
  logs{ show }
  integrations{ show initialise }
  blogPosts{ show create }
  blogPostComments{ show create }
  blogPostStatuses{ show }
}
`;

/**
 * AuthenticationFields Fragment
 */
export const AUTHENTICATION_FIELDS_FRAGMENT = gql`
fragment AuthenticationFields on AuthenticationNode {
  user_id
  user_name
  access_token
  access_token_object{
    data{
      permissions
    }
  }
  refresh_token
  can{
    ...AuthorisedActionsFields
  }
}
${AUTHORISED_ACTIONS_FIELDS_FRAGMENT}
`;

const ACTIONS_QUERY = gql`
query Actions {
  can{
    ...AuthorisedActionsFields
  }
}
${AUTHORISED_ACTIONS_FIELDS_FRAGMENT}
`;

/**
 * Logout
 */
const LOGOUT_MUTATION = gql`
mutation Logout{
  logout{
    can{
      ...AuthorisedActionsFields
    }
  }
}
${AUTHORISED_ACTIONS_FIELDS_FRAGMENT}
`;

/**
 * Refresh
 */
const REFRESH_MUTATION = gql`
mutation Refresh(
  $refresh_token:String
){
  refresh(
    dto:{
      refresh_token:$refresh_token
    }
  ){
    ...AuthenticationFields
  }
}
${AUTHENTICATION_FIELDS_FRAGMENT}
`

const LOGIN_MUTATION = gql`
mutation Login(
  $name_or_email:String!
  $password:String!
){
  login(
    dto:{
      name_or_email:$name_or_email
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${AUTHENTICATION_FIELDS_FRAGMENT}
`


/**
 * Register
 */
const REGISTER_MUTATION = gql`
mutation Register(
  $name:String!
  $email:String!
  $password:String!
){
  register(
    dto:{
      name:$name
      email:$email
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${AUTHENTICATION_FIELDS_FRAGMENT}
`

/**
 * Password Reset
 */
const CONSUME_PASSWORD_RESET_TOKEN_MUTATION = gql`
mutation ConsumePasswordResetToken(
  $token:String!
  $password:String!
){
  consumePasswordResetToken(
    dto:{
      token:$token
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${AUTHENTICATION_FIELDS_FRAGMENT}
`;

/**
 * Accept Welcome
 */
const CONSUME_WELCOME_TOKEN_MUTATION = gql`
mutation ConsumeWelcomeToken(
  $token:String!
  $name:String!
  $password:String!
){
  consumeWelcomeToken(
    dto:{
      token:$token
      name:$name
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${AUTHENTICATION_FIELDS_FRAGMENT}
`;

/**
 * VerifyEmailChange
 */
const CONSUME_EMAIL_CHANGE_TOKEN_MUTATION = gql`
mutation ConsumeEmailChangeToken(
  $token:String!
){
  consumeEmailChangeToken(
    dto:{
      token:$token
    }
  ){
    ...AuthenticationFields
  }
}
${AUTHENTICATION_FIELDS_FRAGMENT}
`;

/**
 * Consume Verification
 */
const CONSUME_VERIFICATION_TOKEN_MUTATION = gql`
mutation ConsumeVerificationToken(
  $token:String!
){
  consumeVerificationToken(
    dto:{
      token:$token
    }
  ){
    ...AuthenticationFields
  }
}
${AUTHENTICATION_FIELDS_FRAGMENT}
`;



export type IApiCredentialsFactoryArg = {
  me: IApiMe;
  publicEnv: PublicEnv;
  credentialedGqlClient: GraphQLClient;
  uncredentialedGqlClient: GraphQLClient;
  httpClient: ApiHttpClient;
  refreshGqlClient: GraphQLClient;
  event: IApiEvents;
};

/**
 * Create ApiCredentials
 *
 * @param arg
 */
export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArg): ApiCredentials {
  const {
    me,
    credentialedGqlClient,
    publicEnv,
    uncredentialedGqlClient,
    refreshGqlClient,
    event,
    httpClient,
  } = arg;
  const credentials = new ApiCredentials(
    publicEnv,
    credentialedGqlClient,
    uncredentialedGqlClient,
    refreshGqlClient,
    httpClient,
    event,
    me,
  );
  return credentials;
}


// declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

// isoFetch()
export interface IHttpClientWrapper { me: IApiMe; credentialed: boolean; graphql: GraphQLClient; http: ApiHttpClient }
export interface IApiCredentialsLoginArg { name_or_email: string; password: string; }
export interface IApiCredentialsRegisterArg { name: string; email: string; password: string; }
export interface IApiCredentialsVerifyEmailArg { token: string; }
export interface IApiCredentialsResetPasswordArg { token: string; password: string; }
export interface IApiCredentialsConsumeUserWelcomeArg { token: string; name: string; password: string; }
export interface IApiCredentialsConsumeChangeVerificationArg { token: string; }
export interface IApiCredentialsRequestPasswordResetEmailArg { email: string; }

function setClientHeaders(arg: {
  readonly _me: IApiMe;
  readonly credentialedGqlClient: GraphQLClient;
  readonly uncredentialedGqlClient: GraphQLClient;
  readonly refreshGqlClient: GraphQLClient;
  readonly httpClient: ApiHttpClient;
}) {
  const {
    _me,
    credentialedGqlClient,
    uncredentialedGqlClient,
    refreshGqlClient,
    httpClient,
  } = arg;
  const sharedHeaders: [string, string][] = [
    ['Accept', 'application/json'],
    ...((_me.aid ? [[_header_aid_key, _me.aid]] : []) as [string, string][]),
  ];
  const credHeaders: [string, string][] = _me.user ? [['authorization', `Bearer ${_me.user.access_token}`]] : [];
  const refreshHeaders: [string, string][] = _me.user ? [['refresh_token', _me.user.refresh_token]] : [];
  // uncrednetialed client
  uncredentialedGqlClient.setHeaders([ ...sharedHeaders, ]);
  // credentialed client
  credentialedGqlClient.setHeaders([ ...sharedHeaders, ...credHeaders, ]);
  // refresh client
  refreshGqlClient.setHeaders([ ...sharedHeaders, ...refreshHeaders, ]);
  // http client
  httpClient.setHeaders([ ...sharedHeaders, ...credHeaders, ]);
  httpClient.setCredentialed(!!_me.user);
}

export class ApiCredentials {
  // protected readonly syncLock: Mutex = new Mutex();
  protected readonly authenticationLock: Mutex = new Mutex();

  get me(): IApiMe { return this._me; }

  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly credentialedGqlClient: GraphQLClient,
    protected readonly uncredentialedGqlClient: GraphQLClient,
    protected readonly refreshGqlClient: GraphQLClient,
    protected readonly httpClient: ApiHttpClient,
    protected readonly event: IApiEvents,
    protected _me: IApiMe,
  ) {
    this.event.authenticated.on((me) => { Debug.ApiCredentials('on::authenticated', me); });
    this.event.unauthenticated.on((me) => { Debug.ApiCredentials('on::unauthenticated', me); });

    this.event.log_in_start.on(() => { Debug.ApiCredentials('on::log_in_start'); });
    this.event.log_in_success.on(() => { Debug.ApiCredentials('on::log_in_success'); });
    this.event.log_in_fail.on(() => { Debug.ApiCredentials('on::log_in_fail'); });

    this.event.log_out_start.on(() => { Debug.ApiCredentials('on::log_out_start'); });
    this.event.log_out_success.on(() => { Debug.ApiCredentials('on::log_out_success'); });
    this.event.log_out_fail.on(() => { Debug.ApiCredentials('on::log_out_fail'); });

    this.event.register_start.on(() => { Debug.ApiCredentials('on::register_start'); });
    this.event.register_success.on(() => { Debug.ApiCredentials('on::register_success'); });
    this.event.register_fail.on(() => { Debug.ApiCredentials('on::register_fail'); });

    this.event.verify_start.on(() => { Debug.ApiCredentials('on::verify_start'); });
    this.event.verify_success.on(() => { Debug.ApiCredentials('on::verify_success'); });
    this.event.verify_fail.on(() => { Debug.ApiCredentials('on::verify_fail'); });

    this.event.reset_password_start.on(() => { Debug.ApiCredentials('on::reset_password_start'); });
    this.event.reset_password_success.on(() => { Debug.ApiCredentials('on::reset_password_success'); });
    this.event.reset_password_fail.on(() => { Debug.ApiCredentials('on::reset_password_fail'); });

    this.event.refresh_start.on(() => { Debug.ApiCredentials('on::refresh_start'); });
    this.event.refresh_success.on(() => { Debug.ApiCredentials('on::refresh_success'); });
    this.event.refresh_fail.on(() => { Debug.ApiCredentials('on::refresh_fail'); });

    this.event.accept_welcome_start.on(() => { Debug.ApiCredentials('on::accept_welcome_start'); });
    this.event.accept_welcome_success.on(() => { Debug.ApiCredentials('on::accept_welcome_success'); });
    this.event.accept_welcome_fail.on(() => { Debug.ApiCredentials('on::accept_welcome_fail'); });

    this.event.verify_email_change_start.on(() => { Debug.ApiCredentials('on::verify_email_change_start'); });
    this.event.verify_email_change_success.on(() => { Debug.ApiCredentials('on::verify_email_change_success'); });
    this.event.verify_email_change_fail.on(() => { Debug.ApiCredentials('on::verify_email_change_fail'); });

    this.event.force_out_start.on(() => { Debug.ApiCredentials('on::force_out_start'); });
    this.event.force_out_success.on(() => { Debug.ApiCredentials('on::force_out_success'); });
    this.event.force_out_fail.on(() => { Debug.ApiCredentials('on::force_out_fail'); });

    setClientHeaders({
      _me: this._me,
      credentialedGqlClient: this.credentialedGqlClient,
      refreshGqlClient: this.refreshGqlClient,
      uncredentialedGqlClient: this.uncredentialedGqlClient,
      httpClient: this.httpClient,
    });
  }


  /**
   * Am I authenticated?
   */
  isAuthenticated(): boolean {
    return apiMeFns.isAuthenticated(this._me);
  }


  /**
   * Is Authenticating / Unauthenticaing
   */
  isRunning(): boolean {
    return this.authenticationLock.isLocked();
  }


  /**
   * Wait for everything to be settled and get me...
   */
  async getSafeMe(): Promise<IApiMe> {
    // wait for lock to settle & get me
    const unlock = await this.authenticationLock.acquire();
    const me = this._me;
    unlock();
    return me;
  }


  /**
   * Save the authentication
   *
   * @param me
   */
  protected _saveAuthentication(me: IApiMe): void {
    this._me = me;
    // set headers
    setClientHeaders({
      _me: this._me,
      credentialedGqlClient: this.credentialedGqlClient,
      refreshGqlClient: this.refreshGqlClient,
      uncredentialedGqlClient: this.uncredentialedGqlClient,
      httpClient: this.httpClient,
    });
    this.event.authenticated.fire(me);
  }


  /**
   * Remove the authentication
   */
  protected _removeAuthentication(me: IApiMe): void {
    this._me = me;
    // set headers
    setClientHeaders({
      _me: this._me,
      credentialedGqlClient: this.credentialedGqlClient,
      refreshGqlClient: this.refreshGqlClient,
      uncredentialedGqlClient: this.uncredentialedGqlClient,
      httpClient: this.httpClient,
    });
    this.event.unauthenticated.fire(me);
  }


  /**
   * Wait for everything to be settled & then get a Client
   */
  async getSafeRequester(): Promise<IHttpClientWrapper> {
    const unlock = await this.authenticationLock.acquire();
    const me = this._me;
    unlock();
    if (apiMeFns.isAuthenticated(me)) {
      return {
        me,
        credentialed: true,
        graphql: this.credentialedGqlClient,
        http: this.httpClient,
      }
    }
    return {
      me,
      credentialed: false,
      graphql: this.uncredentialedGqlClient,
      http: this.httpClient,
    }
  }


  /**
   * Force out
   *
   *  1. Want to handle login / logout routes with GraphQL
   *  2. Authentication can
   *  3. ... todo
   */
  async _unlockedForceOut(): Promise<ActionsQuery> {
    try {
      this.event.force_out_start.fire(undefined);
      const vars: ActionsQueryVariables = {};
      const result = await this.uncredentialedGqlClient.request<ActionsQuery>(ACTIONS_QUERY, vars);
      const me = apiMeFns.unauthenticate({ can: result.can, ss: false });
      this._removeAuthentication(me);
      this.event.force_out_success.fire(me);
      return result;
    } catch (error) {
      this.event.force_out_fail.fire(undefined);
      throw error;
    }
  }


  /**
   * Get the actions I can take...
   */
  async _unlockedActions(client: GraphQLClient): Promise<AuthorisedActionsFieldsFragment> {
    // eslint-disable-next-line no-useless-catch
    try {
      const vars: ActionsQueryVariables = {};
      const result = await client.request<ActionsQuery>(ACTIONS_QUERY, vars);
      return result.can;
    } catch (error) {
      throw error;
    }
  }


  /**
   * Logout
   */
  async _unlockedLogout(): Promise<AuthorisedActionsFieldsFragment> {
    try {
      this.event.log_out_start.fire(undefined);
      const logoutVars: LogoutMutationVariables = {};
      // remove credentials before attempting log-out
      // otherwise, if credentials are kept but stale, they will be 401'd by the server
      this.credentialedGqlClient.setHeader('Authorization', 'Bearer ');
      this.refreshGqlClient.setHeader('refresh_token', '');
      await this.credentialedGqlClient.request<LogoutMutation, LogoutMutationVariables>(LOGOUT_MUTATION, logoutVars);
      // now that we've logged out, determine which actions we can take...
      const can = await this._unlockedActions(this.uncredentialedGqlClient);
      const me = apiMeFns.unauthenticate({ can, ss: false });
      this._removeAuthentication(me);
      this.event.log_out_success.fire(me);
      return can;
    } catch(error) {
      this.event.log_out_fail.fire(undefined);
      await this._unlockedForceOut().catch();
      throw error;
    }
  }


  /**
   * Get the latest version of me
   */
  async actions(): Promise<AuthorisedActionsFieldsFragment> {
    const requester = await this.getSafeRequester()
    const release = await this.authenticationLock.acquire();
    try {
      return this._unlockedActions(requester.graphql);
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      release();
    }
  }


  /**
   * Synchronise my actions
   *
   * Shares logic with refresh
   */
  async resyncMe(): Promise<AuthorisedActionsFieldsFragment> {
    console.log(`[ApiCredentials::resyncMe::1] Requesting client...`);
    // get requester when credentials are settled
    const requester1 = await this.getSafeRequester();
    const release = await this.authenticationLock.acquire();
    try {
      // requester isn't credentialed - just send raw request
      if (!requester1.credentialed) {
        console.log(`[ApiCredentials::resyncMe::2] Making uncredentialed "can" request...`);
        const can = await this._unlockedActions(requester1.graphql);
        const me = apiMeFns.unauthenticate({ can, ss: false, });
        console.log(`[ApiCredentials::resyncMe::3] Uncredentialed  request successful...`);
        this._saveAuthentication(me);
        return can;
      }
      try {
        console.log(`[ApiCredentials::resyncMe::4] Making credentialed "refresh" request...`);
        this.event.refresh_start.fire(undefined);
        const vars: RefreshMutationVariables = {};
        const result = await this.refreshGqlClient.request<RefreshMutation, RefreshMutationVariables>(REFRESH_MUTATION, vars);
        const me = apiMeFns.authenticate({ authentication: result.refresh, ss: false, });
        this._saveAuthentication(me);
        this.event.refresh_success.fire(me);
        console.log(`[ApiCredentials::resyncMe::5] Refresh successful...`);
        return result.refresh.can;
      }
      catch (error) {
        console.log(`[ApiCredentials::resyncMe::6] Refresh failed...`);
        this.event.refresh_fail.fire(undefined);
        await this._unlockedLogout().catch();
        throw error;
      }
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      console.log(`[ApiCredentials::resyncMe::7] Resync failed...`);
      throw error;
    } finally {
      release();
    }
  }

  /**
   * Refresh authentication
   */
  async refresh(): Promise<RefreshMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.refresh_start.fire(undefined);
      const vars: RefreshMutationVariables = {};
      const result = await this.refreshGqlClient.request<RefreshMutation, RefreshMutationVariables>(REFRESH_MUTATION, vars);
      const me = apiMeFns.authenticate({ authentication: result.refresh, ss: false, });
      this._saveAuthentication(me);
      this.event.refresh_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.refresh_fail.fire(undefined);
      await this._unlockedLogout().catch();
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Login
   */
  async login(arg: IApiCredentialsLoginArg): Promise<LoginMutation> {
    const { name_or_email, password } = arg;
    const release = await this.authenticationLock.acquire();
    try {
      this.event.log_in_start.fire(undefined);
      const vars: LoginMutationVariables = { name_or_email, password, };
      const result = await this.credentialedGqlClient.request<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, vars);
      const me = apiMeFns.authenticate({ authentication: result.login, ss: false, });
      this._saveAuthentication(me);
      this.event.log_in_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.log_in_fail.fire(undefined);
      await this._unlockedLogout().catch();
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Register
   */
  async register(arg: IApiCredentialsRegisterArg): Promise<RegisterMutation> {
    const { name, email, password } = arg;
    const release = await this.authenticationLock.acquire();
    try {
      this.event.register_start.fire(undefined);
      const vars: RegisterMutationVariables = { name, email, password, };
      const result = await this.credentialedGqlClient.request<RegisterMutation, RegisterMutationVariables>(REGISTER_MUTATION, vars);
      const me = apiMeFns.authenticate({ authentication: result.register, ss: false, });
      this._saveAuthentication(me);
      this.event.register_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.register_fail.fire(undefined);
      await this._unlockedLogout().catch();
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Logout
   */
  async logout(): Promise<AuthorisedActionsFieldsFragment> {
    const release = await this.authenticationLock.acquire();
    try {
      const result = await this._unlockedLogout();
      return result;
    }
    // eslint-disable-next-line no-useless-catch
    catch (error) {
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Consume ResetPassword
   */
  async consumePasswordResetToken(arg: IApiCredentialsResetPasswordArg): Promise<ConsumePasswordResetTokenMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.reset_password_start.fire(undefined);
      const vars: ConsumePasswordResetTokenMutationVariables = {
        token: arg.token,
        password: arg.password,
      };
      const result = await this
        .credentialedGqlClient
        .request<ConsumePasswordResetTokenMutation, ConsumePasswordResetTokenMutationVariables>(
          CONSUME_PASSWORD_RESET_TOKEN_MUTATION,
          vars,
        );
      const me = apiMeFns.authenticate({
        authentication: result.consumePasswordResetToken,
        ss: false,
      });
      this._saveAuthentication(me);
      this.event.reset_password_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.reset_password_fail.fire(undefined);
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Consume WelcomeToken
   */
  async consumeWelcomeToken(arg: IApiCredentialsConsumeUserWelcomeArg): Promise<ConsumeWelcomeTokenMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.accept_welcome_start.fire(undefined);
      const vars: ConsumeWelcomeTokenMutationVariables = {
        token: arg.token,
        name: arg.name,
        password: arg.password,
      };
      const result = await this
        .credentialedGqlClient
        .request<ConsumeWelcomeTokenMutation, ConsumeWelcomeTokenMutationVariables>(
          CONSUME_WELCOME_TOKEN_MUTATION,
          vars,
        );
      const me = apiMeFns.authenticate({ authentication: result.consumeWelcomeToken, ss: false, });
      this._saveAuthentication(me);
      this.event.accept_welcome_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.accept_welcome_fail.fire(undefined);
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Consume EmailChangeVerification
   */
  async consumeEmailChangeToken(arg: IApiCredentialsConsumeChangeVerificationArg): Promise<ConsumeEmailChangeTokenMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.verify_email_change_start.fire(undefined);
      const vars: ConsumeEmailChangeTokenMutationVariables = { token: arg.token, };
      const result = await this
        .credentialedGqlClient
        .request<ConsumeEmailChangeTokenMutation, ConsumeEmailChangeTokenMutationVariables>(
          CONSUME_EMAIL_CHANGE_TOKEN_MUTATION,
          vars,
        );
      const me = apiMeFns.authenticate({
        authentication: result.consumeEmailChangeToken,
        ss: false,
      });
      this._saveAuthentication(me);
      this.event.verify_email_change_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.verify_email_change_fail.fire(undefined);
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Consume VerificationToken
   */
  async consumeVerificationToken(vars: ConsumeVerificationTokenMutationVariables): Promise<ConsumeVerificationTokenMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.verify_start.fire(undefined);
      const result = await this
        .credentialedGqlClient
        .request<ConsumeVerificationTokenMutation, ConsumeVerificationTokenMutationVariables>(
          CONSUME_VERIFICATION_TOKEN_MUTATION,
          vars,
        );
      const me = apiMeFns.authenticate({
        authentication: result.consumeVerificationToken,
        ss: false,
      });
      this._saveAuthentication(me);
      this.event.verify_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.verify_fail.fire(undefined);
      throw error;
    }
    finally {
      release();
    }
  }
}
