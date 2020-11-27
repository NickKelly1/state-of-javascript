import { Mutex, } from 'async-mutex';
import { gql, GraphQLClient, } from 'graphql-request';
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
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
  AcceptWelcomeMutation,
  AcceptWelcomeMutationVariables,
} from '../generated/graphql';
import { IApiEvents } from './api.events';
import { ApiMe, ApiMeFactory, } from './api.me';


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
const verifyEmailMutation = gql`
mutation VerifyEmail(
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
const resetPasswordMutation = gql`
mutation ResetPassword(
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
const acceptWelcomeMutation = gql`
mutation AcceptWelcome(
  $token:String!
  $name:String!
  $password:String!
){
  acceptUserWelcome(
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

export enum ApiCredentialsFactoryArgType {
  WithMe,
  WithCredentials,
  WithoutCredentials,
}

type IApiCredentialsFactoryArgWithMe = {
  type: ApiCredentialsFactoryArgType.WithMe
  me: ApiMe;
  publicEnv: PublicEnv,
  credentialedGqlClient: GraphQLClient,
  uncredentialedGqlClient: GraphQLClient,
  refreshGqlClient: GraphQLClient,
  event: IApiEvents,
};
type IApiCredentialsFactoryArgWithCredentials = {
  type: ApiCredentialsFactoryArgType.WithCredentials
  me: undefined;
  publicEnv: PublicEnv,
  credentialedGqlClient: GraphQLClient,
  uncredentialedGqlClient: GraphQLClient,
  refreshGqlClient: GraphQLClient,
  event: IApiEvents,
};
type IApiCredentialsFactoryArgWithoutCredentials = {
  type: ApiCredentialsFactoryArgType.WithoutCredentials
  me: undefined;
  publicEnv: PublicEnv,
  credentialedGqlClient: GraphQLClient,
  uncredentialedGqlClient: GraphQLClient,
  refreshGqlClient: GraphQLClient,
  event: IApiEvents,
};

export type IApiCredentialsFactoryArg =
  | IApiCredentialsFactoryArgWithMe
  | IApiCredentialsFactoryArgWithCredentials
  | IApiCredentialsFactoryArgWithoutCredentials;


/**
 * Create ApiCredentials
 *
 * @param arg
 */
export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArgWithMe): ApiCredentials
export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArgWithCredentials): Promise<ApiCredentials>
export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArgWithoutCredentials): Promise<ApiCredentials>
export function ApiCredentialsFactory(arg: IApiCredentialsFactoryArg): ApiCredentials | Promise<ApiCredentials> {

  switch (arg.type) {

    // with me
    case ApiCredentialsFactoryArgType.WithMe: {
      const {
        me,
        credentialedGqlClient,
        publicEnv,
        uncredentialedGqlClient,
        refreshGqlClient,
        event,
      } = arg;
      const creds = new ApiCredentials(
        publicEnv,
        credentialedGqlClient,
        uncredentialedGqlClient,
        refreshGqlClient,
        event,
        me,
      );
      return creds;
    }

    // with credentials
    case ApiCredentialsFactoryArgType.WithCredentials: {
      const {
        credentialedGqlClient,
        publicEnv,
        uncredentialedGqlClient,
        refreshGqlClient,
        event,
      } = arg;
      const vars: RefreshMutationVariables = {};
      return refreshGqlClient
        .request<RefreshMutation, RefreshMutationVariables>(refreshMutation, vars)
        .then(result => {
          const me = ApiMeFactory({ authenticated: true, value: result.refresh });
          const creds = new ApiCredentials(
            publicEnv,
            credentialedGqlClient,
            uncredentialedGqlClient,
            refreshGqlClient,
            event,
            me,
          );
          return creds;
        });
    }

    // without credentials
    case ApiCredentialsFactoryArgType.WithoutCredentials: {
      const {
        credentialedGqlClient,
        publicEnv,
        uncredentialedGqlClient,
        refreshGqlClient,
        event,
      } = arg;
      const vars: ActionsQueryVariables = {};
      return uncredentialedGqlClient
        .request<ActionsQuery, ActionsQueryVariables>(actionsQuery, vars)
        .then(result => {
          const me = ApiMeFactory({ authenticated: false, value: result.can });
          const creds = new ApiCredentials(
            publicEnv,
            credentialedGqlClient,
            uncredentialedGqlClient,
            refreshGqlClient,
            event,
            me,
          );
          return creds;
        });
    }


    default: {
      // @ts-expect-error
      throw new Error(`Unhandled type: "${(arg).type}"`);
    }
  }
}

export interface IGraphQLClientWrapper {
  me: ApiMe;
  credentialed: boolean;
  client: GraphQLClient;
}

export interface IApiCredentialsLoginArg {
  name_or_email: string;
  password: string;
}


export interface IApiCredentialsRegisterArg {
  name: string;
  email: string;
  password: string;
}

export interface IApiCredentialsVerifyEmailArg {
  token: string;
}

export interface IApiCredentialsResetPasswordArg {
  token: string;
  password: string;
}

export interface IApiCredentialsAcceptWelcomeArg {
  token: string;
  name: string;
  password: string;
}


export class ApiCredentials {
  // protected readonly syncLock: Mutex = new Mutex();
  protected readonly authenticationLock: Mutex = new Mutex();

  get me(): ApiMe { return this._me; }

  constructor(
    protected readonly publicEnv: PublicEnv,
    protected readonly credentialedGqlClient: GraphQLClient,
    protected readonly uncredentialedGqlClient: GraphQLClient,
    protected readonly refreshGqlClient: GraphQLClient,
    protected readonly event: IApiEvents,
    protected _me: ApiMe,
  ) {
    this.event.authenticated.on(() => { Debug.BackendApiCredentials('on::authenticated'); });
    this.event.unauthenticated.on(() => { Debug.BackendApiCredentials('on::unauthenticated'); });

    this.event.log_in_start.on(() => { Debug.BackendApiCredentials('on::log_in_start'); });
    this.event.log_in_success.on(() => { Debug.BackendApiCredentials('on::log_in_success'); });
    this.event.log_in_fail.on(() => { Debug.BackendApiCredentials('on::log_in_fail'); });

    this.event.register_start.on(() => { Debug.BackendApiCredentials('on::register_start'); });
    this.event.register_success.on(() => { Debug.BackendApiCredentials('on::register_success'); });
    this.event.register_fail.on(() => { Debug.BackendApiCredentials('on::register_fail'); });

    this.event.verify_email_start.on(() => { Debug.BackendApiCredentials('on::verify_email_start'); });
    this.event.verify_email_success.on(() => { Debug.BackendApiCredentials('on::verify_email_success'); });
    this.event.verify_email_fail.on(() => { Debug.BackendApiCredentials('on::verify_email_fail'); });

    this.event.reset_password_start.on(() => { Debug.BackendApiCredentials('on::reset_password_start'); });
    this.event.reset_password_success.on(() => { Debug.BackendApiCredentials('on::reset_password_success'); });
    this.event.reset_password_fail.on(() => { Debug.BackendApiCredentials('on::reset_password_fail'); });

    this.event.refresh_start.on(() => { Debug.BackendApiCredentials('on::refresh_start'); });
    this.event.refresh_success.on(() => { Debug.BackendApiCredentials('on::refresh_success'); });
    this.event.refresh_fail.on(() => { Debug.BackendApiCredentials('on::refresh_fail'); });

    this.event.accept_welcome_start.on(() => { Debug.BackendApiCredentials('on::accept_welcome_start'); });
    this.event.accept_welcome_success.on(() => { Debug.BackendApiCredentials('on::accept_welcome_success'); });
    this.event.accept_welcome_fail.on(() => { Debug.BackendApiCredentials('on::accept_welcome_fail'); });
  }


  /**
   * Am I authenticated?
   */
  isAuthenticated(): boolean {
    return this._me.isAuthenticated;
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
  async getSafeMe(): Promise<ApiMe> {
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
  protected _saveAuthentication(me: ApiMe): void {
    this._me = me;
    this.event.authenticated.fire(me);
  }


  /**
   * Remove the authentication
   */
  protected _removeAuthentication(me: ApiMe): void {
    this._me = me;
    this.event.unauthenticated.fire(me);
  }


  /**
   * Wait for everything to be settled & then get a Client
   */
  async getSafeRequester(): Promise<IGraphQLClientWrapper> {
    const unlock = await this.authenticationLock.acquire();
    const me = this._me;
    unlock();
    if (me.isAuthenticated) {
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
   * Refresh authentication
   */
  async refresh(): Promise<RefreshMutation> {
    // TODO: use a different requester....

    const release = await this.authenticationLock.acquire();
    try {
      this.event.refresh_start.fire(undefined);
      const vars: RefreshMutationVariables = {};
      const result = await this
        .refreshGqlClient
        .request<RefreshMutation, RefreshMutationVariables>(refreshMutation, vars);
      const me = ApiMeFactory({ authenticated: true, value: result.refresh });
      this._saveAuthentication(me);
      this.event.refresh_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.refresh_fail.fire(undefined);

      // try to log out...
      try {
        this.event.log_out_start.fire(undefined);
        const logoutVars: LogoutMutationVariables = {};
        const logoutResult = await this
          .credentialedGqlClient
          .request<LogoutMutation, LogoutMutationVariables>(logoutMutation, logoutVars);
        const meOut = ApiMeFactory({ authenticated: false, value: logoutResult.logout.can });
        this._removeAuthentication(meOut);
        this.event.log_out_success.fire(meOut);
      } catch {
        this.event.log_out_fail.fire(undefined);
      }

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
      const vars: LoginMutationVariables = {
        name_or_email,
        password,
      };
      const result = await this
        .credentialedGqlClient
        .request<LoginMutation, LoginMutationVariables>(
          loginMutation,
          vars,
        );
      const me = ApiMeFactory({ authenticated: true, value: result.login });
      this._saveAuthentication(me);
      this.event.log_in_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.log_in_fail.fire(undefined);

      // try to log out...
      try {
        this.event.log_out_start.fire(undefined);
        const logoutVars: LogoutMutationVariables = {};
        const logoutResult = await this
          .credentialedGqlClient
          .request<LogoutMutation, LogoutMutationVariables>(logoutMutation, logoutVars);
        const meOut = ApiMeFactory({ authenticated: false, value: logoutResult.logout.can });
        this._removeAuthentication(meOut);
        this.event.log_out_success.fire(meOut);
      } catch {
        this.event.log_out_fail.fire(undefined);
      }

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
      const vars: RegisterMutationVariables = {
        name,
        email,
        password,
      };
      const result = await this
        .credentialedGqlClient
        .request<RegisterMutation, RegisterMutationVariables>(
          registerMutation,
          vars,
        );
      const me = ApiMeFactory({ authenticated: true, value: result.register });
      this._saveAuthentication(me);
      this.event.register_success.fire(me);
      return result;
    }
    catch (error) {
      this.event.register_fail.fire(undefined);

      // try to log out...
      try {
        this.event.log_out_start.fire(undefined);
        const logoutVars: LogoutMutationVariables = {};
        const logoutResult = await this
          .credentialedGqlClient
          .request<LogoutMutation, LogoutMutationVariables>(logoutMutation, logoutVars);
        const meOut = ApiMeFactory({ authenticated: false, value: logoutResult.logout.can });
        this._removeAuthentication(meOut);
        this.event.log_out_success.fire(meOut);
      } catch {
        this.event.log_out_fail.fire(undefined);
      }

      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Logout
   */
  async logout(): Promise<LogoutMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.log_out_start.fire(undefined);
      const logoutVars: LogoutMutationVariables = {};
      const logoutResult = await this
        .credentialedGqlClient
        .request<LogoutMutation, LogoutMutationVariables>(logoutMutation, logoutVars);
      const meOut = ApiMeFactory({ authenticated: false, value: logoutResult.logout.can });
      this._removeAuthentication(meOut);
      this.event.log_out_success.fire(meOut);
      return logoutResult;
    }
    catch (error) {
      this.event.log_out_fail.fire(undefined);
      throw error;
    }
    finally {
      release();
    }
  }


  /**
   * Verify Email
   */
  async verifyEmail(arg: IApiCredentialsVerifyEmailArg): Promise<VerifyEmailMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.verify_email_start.fire(undefined);
      const vars: VerifyEmailMutationVariables = {
        token: arg.token,
      };
      const result = await this
        .credentialedGqlClient
        .request<VerifyEmailMutation, VerifyEmailMutationVariables>(verifyEmailMutation, vars);
      const me = ApiMeFactory({ authenticated: true, value: result.consumeEmailVerification });
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
   * Reset Password
   */
  async resetPassword(arg: IApiCredentialsResetPasswordArg): Promise<ResetPasswordMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.reset_password_start.fire(undefined);
      const vars: ResetPasswordMutationVariables = {
        token: arg.token,
        password: arg.password,
      };
      const result = await this
        .credentialedGqlClient
        .request<ResetPasswordMutation, ResetPasswordMutationVariables>(resetPasswordMutation, vars);
      const me = ApiMeFactory({ authenticated: true, value: result.consumeForgottenUserPasswordReset });
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
   * Accept Welcome
   */
  async acceptWelcome(arg: IApiCredentialsAcceptWelcomeArg): Promise<AcceptWelcomeMutation> {
    const release = await this.authenticationLock.acquire();
    try {
      this.event.accept_welcome_start.fire(undefined);
      const vars: AcceptWelcomeMutationVariables = {
        token: arg.token,
        name: arg.name,
        password: arg.password,
      };
      const result = await this
        .credentialedGqlClient
        .request<AcceptWelcomeMutation, AcceptWelcomeMutationVariables>(acceptWelcomeMutation, vars);
      const me = ApiMeFactory({ authenticated: true, value: result.acceptUserWelcome });
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
}
