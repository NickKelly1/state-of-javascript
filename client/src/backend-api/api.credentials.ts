import { Mutex } from 'async-mutex';
import { gql, GraphQLClient, } from 'graphql-request';
import { _header_shad_id_key } from '../constants/shad-id.const';
import { Debug } from '../debug/debug';
import { PublicEnv } from '../env/public-env.helper';
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
  ConsumeEmailVerificationMutation,
  ConsumeEmailVerificationMutationVariables,
  ConsumeResetPasswordMutation,
  ConsumeResetPasswordMutationVariables,
  ConsumeUserWelcomeMutation,
  ConsumeUserWelcomeMutationVariables,
  ConsumeEmailChangeVerificationMutation,
  ConsumeEmailChangeVerificationMutationVariables,
  AuthorisedActionsFieldsFragment,
} from '../generated/graphql';
import { ist } from '../helpers/ist.helper';
import { IApiEvents } from './api.events';
import { apiMeFns, IApiMe } from './api.me';


/**
 * AuthorisedActionsFields Fragment
 */
export const authorisedActionsFieldsFragment = gql`
fragment AuthorisedActionsFields on ActionsNode {
  users{
    show
    login
    register
    create
    logout
  }
  roles{
    show
    create
  }
  userRoles{
    show
  }
  permissions{
    show
  }
  rolePermissions{
    show
  }
  npmsPackages{
    show
    create
  }
  npmsDashboards{
    show
    sort
    create
  }
  npmsDashboardItems{
    show
  }
  newsArticles{
    show
    create
  }
  newsArticleStatuses{
    show
  }
  jobs{
    show
  }
  logs{
    show
  }
  integrations{
    show
    initialise
  }
}
`;

/**
 * AuthenticationFields Fragment
 */
export const authenticationFieldsFragment = gql`
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
${authorisedActionsFieldsFragment}
`;

const actionsQuery = gql`
query Actions {
  can{
    ...AuthorisedActionsFields
  }
}
${authorisedActionsFieldsFragment}
`;

/**
 * Logout
 */
const logoutMutation = gql`
mutation Logout{
  logout{
    can{
      ...AuthorisedActionsFields
    }
  }
}
${authorisedActionsFieldsFragment}
`;

/**
 * Refresh
 */
const refreshMutation = gql`
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
${authenticationFieldsFragment}
`

const loginMutation = gql`
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
${authenticationFieldsFragment}
`


/**
 * Register
 */
const registerMutation = gql`
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
${authenticationFieldsFragment}
`

/**
 * Consume Verify Email
 */
const consumeEmailVerificationMutation = gql`
mutation ConsumeEmailVerification(
  $token:String!
){
  consumeEmailVerification(
    dto:{
      token:$token
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`;

/**
 * Password Reset
 */
const consumeResetPasswordMutation = gql`
mutation ConsumeResetPassword(
  $token:String!
  $password:String!
){
  consumeForgottenUserPasswordReset(
    dto:{
      token:$token
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`;

/**
 * Accept Welcome
 */
const consumeUserWelcomeMutation = gql`
mutation ConsumeUserWelcome(
  $token:String!
  $name:String!
  $password:String!
){
  consumeUserWelcome(
    dto:{
      token:$token
      name:$name
      password:$password
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`;

/**
 * VerifyEmailChange
 */
const consumeEmailChangeVerification = gql`
mutation ConsumeEmailChangeVerification(
  $token:String!
){
  consumeEmailChangeVerification(
    dto:{
      token:$token
    }
  ){
    ...AuthenticationFields
  }
}
${authenticationFieldsFragment}
`;

export type IApiCredentialsFactoryArg = {
  me: IApiMe;
  publicEnv: PublicEnv,
  credentialedGqlClient: GraphQLClient,
  uncredentialedGqlClient: GraphQLClient,
  refreshGqlClient: GraphQLClient,
  event: IApiEvents,
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
  } = arg;
  const credentials = new ApiCredentials(
    publicEnv,
    credentialedGqlClient,
    uncredentialedGqlClient,
    refreshGqlClient,
    event,
    me,
  );
  return credentials;
}

export interface IGraphQLClientWrapper { me: IApiMe; credentialed: boolean; client: GraphQLClient; }
export interface IApiCredentialsLoginArg { name_or_email: string; password: string; }
export interface IApiCredentialsRegisterArg { name: string; email: string; password: string; }
export interface IApiCredentialsVerifyEmailArg { token: string; }
export interface IApiCredentialsResetPasswordArg { token: string; password: string; }
export interface IApiCredentialsConsumeUserWelcomeArg { token: string; name: string; password: string; }
export interface IApiCredentialsConsumeChangeVerificationArg { token: string; }

function setClientHeaders(arg: {
  readonly _me: IApiMe;
  readonly credentialedGqlClient: GraphQLClient;
  readonly uncredentialedGqlClient: GraphQLClient;
  readonly refreshGqlClient: GraphQLClient;
}) {
  const {
    _me,
    credentialedGqlClient,
    uncredentialedGqlClient,
    refreshGqlClient,
  } = arg;
  const sharedHeaders = _me.shadow_id ? [[_header_shad_id_key, _me.shadow_id]] : [];
  const credHeaders = _me.user ? [['authorization', `Bearer ${_me.user.access_token}`]] : [];
  const refreshHeaders = _me.user ? [['refresh_token', _me.user.refresh_token]] : [];
  // uncrednetialed client
  uncredentialedGqlClient.setHeaders([ ...sharedHeaders, ]);
  // credentialed client
  credentialedGqlClient.setHeaders([ ...credHeaders, ...sharedHeaders, ]);
  // refresh client
  refreshGqlClient.setHeaders([ ...refreshHeaders, ...sharedHeaders, ]);
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

    this.event.verify_email_start.on(() => { Debug.ApiCredentials('on::verify_email_start'); });
    this.event.verify_email_success.on(() => { Debug.ApiCredentials('on::verify_email_success'); });
    this.event.verify_email_fail.on(() => { Debug.ApiCredentials('on::verify_email_fail'); });

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
  isRunning() {
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
    });
    this.event.unauthenticated.fire(me);
  }


  /**
   * Wait for everything to be settled & then get a Client
   */
  async getSafeRequester(): Promise<IGraphQLClientWrapper> {
    const unlock = await this.authenticationLock.acquire();
    const me = this._me;
    unlock();
    if (apiMeFns.isAuthenticated(me)) {
      return {
        me,
        credentialed: true,
        client: this.credentialedGqlClient,
      }
    }
    return {
      me,
      credentialed: false,
      client: this.uncredentialedGqlClient,
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
      const result = await this.uncredentialedGqlClient.request<ActionsQuery>(actionsQuery, vars);
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
    try {
      const vars: ActionsQueryVariables = {};
      const result = await client.request<ActionsQuery>(actionsQuery, vars);
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
      await this.credentialedGqlClient.request<LogoutMutation, LogoutMutationVariables>(logoutMutation, logoutVars);
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
      return this._unlockedActions(requester.client);
    } catch (error) {
      throw error;
    } finally {
      release();
    }
  }

  // async syncWhoami(): Promise<> {
  //   //
  // }


  /**
   * Refresh authentication
   */
  async refresh(): Promise<RefreshMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.refresh_start.fire(undefined);
      const vars: RefreshMutationVariables = {};
      const result = await this.refreshGqlClient.request<RefreshMutation, RefreshMutationVariables>(refreshMutation, vars);
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
      const result = await this.credentialedGqlClient.request<LoginMutation, LoginMutationVariables>(loginMutation, vars);
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
      const result = await this.credentialedGqlClient.request<RegisterMutation, RegisterMutationVariables>(registerMutation, vars);
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
    catch (error) {
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Consume EmailVerification
   */
  async consumeEmailVerification(arg: IApiCredentialsVerifyEmailArg): Promise<ConsumeEmailVerificationMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.verify_email_start.fire(undefined);
      const vars: ConsumeEmailVerificationMutationVariables = { token: arg.token, };
      const result = await this.credentialedGqlClient.request<ConsumeEmailVerificationMutation, ConsumeEmailVerificationMutationVariables>(consumeEmailVerificationMutation, vars);
      const me = apiMeFns.authenticate({ authentication: result.consumeEmailVerification, ss: false, });
      this._saveAuthentication(me);
      this.event.verify_email_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.verify_email_fail.fire(undefined);
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Consume ResetPassword
   */
  async consumeResetPassword(arg: IApiCredentialsResetPasswordArg): Promise<ConsumeResetPasswordMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.reset_password_start.fire(undefined);
      const vars: ConsumeResetPasswordMutationVariables = { token: arg.token, password: arg.password, };
      const result = await this.credentialedGqlClient.request<ConsumeResetPasswordMutation, ConsumeResetPasswordMutationVariables>(consumeResetPasswordMutation, vars);
      const me = apiMeFns.authenticate({ authentication: result.consumeForgottenUserPasswordReset, ss: false, });
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
   * Consume UserWelcome
   */
  async consumeUserWelcome(arg: IApiCredentialsConsumeUserWelcomeArg): Promise<ConsumeUserWelcomeMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.accept_welcome_start.fire(undefined);
      const vars: ConsumeUserWelcomeMutationVariables = { token: arg.token, name: arg.name, password: arg.password, };
      const result = await this.credentialedGqlClient.request<ConsumeUserWelcomeMutation, ConsumeUserWelcomeMutationVariables>(consumeUserWelcomeMutation, vars);
      const me = apiMeFns.authenticate({ authentication: result.consumeUserWelcome, ss: false, });
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
  async consumeEmailChangeVerification(arg: IApiCredentialsConsumeChangeVerificationArg): Promise<ConsumeEmailChangeVerificationMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.verify_email_change_start.fire(undefined);
      const vars: ConsumeEmailChangeVerificationMutationVariables = { token: arg.token, };
      const result = await this.credentialedGqlClient.request<ConsumeEmailChangeVerificationMutation, ConsumeEmailChangeVerificationMutationVariables>( consumeEmailChangeVerification, vars);
      const me = apiMeFns.authenticate({ authentication: result.consumeEmailChangeVerification, ss: false, });
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
}
