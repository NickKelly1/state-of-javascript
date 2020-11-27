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
} from '../generated/graphql';
import { IApiEvents } from './api.events';
import { ApiMe, ApiMeFactory, } from './api.me';


// AuthorisedActionsFields Fragment
const authorisedActionsFieldsFragment = gql`
fragment AuthorisedActionsFields on ActionsNode {
  users{
    show
    login
    register
    create
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
}
`;

// AuthenticationFields Fragment
const authenticationFieldsFragment = gql`
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

    this.event.refresh_start.on(() => { Debug.BackendApiCredentials('on::refresh_start'); });
    this.event.refresh_success.on(() => { Debug.BackendApiCredentials('on::refresh_success'); });
    this.event.refresh_fail.on(() => { Debug.BackendApiCredentials('on::refresh_fail'); });
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
          loginMutation,
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


  // /**
  //  * Sign out
  //  */
  // async signOut(opts?: { unlocked?: boolean }): Promise<null> {
  //   const { unlocked } = opts ?? {};
  //   const release = unlocked ? null : await this.authenticationLock.acquire();
  //   if (this.autoRefreshTimeout) clearTimeout(this.autoRefreshTimeout);

  //   try {
  //     this.event.sign_out_start.fire(undefined);
  //     const response = await isoFetch(
  //       `${this.publicEnv.API_URL}/v1/auth/signout`,
  //       {
  //         credentials: 'include',
  //         mode: 'cors',
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accepts': 'application/json',
  //         },
  //       },
  //     );
  //     const result: null = await response.json();
  //     if (!response.ok) { throw result; }
  //     this.saveAuthentication(undefined);
  //     this.event.sign_out_success.fire(undefined);
  //     this.event.unauthenticated.fire(undefined);
  //     return result;
  //   }

  //   catch (error) {
  //     console.warn('SignOut failed', error);
  //     this.saveAuthentication(undefined);
  //     this.event.sign_in_fail.fire(undefined);
  //     this.event.unauthenticated.fire(undefined);
  //     throw error;
  //   }

  //   finally {
  //     release?.();
  //   }
  // }


  // /**
  //  * Do sign in
  //  *
  //  * @param arg
  //  */
  // async signIn(
  //   props: { name_or_email: string; password: string },
  //   opts?: { unlocked?: boolean; },
  // ): Promise<IAuthenticationRo> {
  //   const { name_or_email, password } = props
  //   const { unlocked } = opts ?? {};
  //   const release = unlocked ? null : await this.authenticationLock.acquire();

  //   try {
  //     this.event.sign_in_start.fire(undefined);
  //     const response = await isoFetch(
  //       `${this.publicEnv.API_URL}/v1/auth/signin`,
  //       {
  //         credentials: 'include',
  //         mode: 'cors',
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accepts': 'application/json',
  //         },
  //         body: JSON.stringify({ name_or_email, password }),
  //       },
  //     );
  //     const result: IAuthenticationRo = await response.json();
  //     if (!response.ok) { throw result; }
  //     const me: ApiMe = authToMe(result);
  //     this.saveAuthentication(me);
  //     this.event.sign_in_success.fire(me);
  //     this.event.authenticated.fire(me);
  //     return result;
  //   }

  //   catch (error) {
  //     // don't clear authentication...
  //     console.warn('SignIn failed', error);
  //     this.event.sign_in_fail.fire(undefined);
  //     throw error;
  //   }

  //   finally {
  //     release?.();
  //   }
  // }


  // /**
  //  * Do sign up
  //  * 
  //  * Server will save access_token and refresh_token in cookies
  //  *
  //  * @param arg
  //  */
  // async signUp(
  //   props: { name: string; email: string; password: string; },
  //   opts?: { unlocked?: boolean; },
  // ): Promise<IAuthenticationRo> {
  //   const { name, email, password } = props;
  //   const { unlocked } = opts ?? {};
  //   const release = unlocked ? null : await this.authenticationLock.acquire();
  //   try {
  //     this.event.sign_up_start.fire(undefined);
  //     const response = await isoFetch(
  //       `${this.publicEnv.API_URL}/v1/auth/signup`,
  //       {
  //         credentials: 'include',
  //         mode: 'cors',
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accepts': 'application/json',
  //         },
  //         body: JSON.stringify({ name, email, password }),
  //       },
  //     );
  //     const result: IAuthenticationRo = await response.json();
  //     if (!response.ok) { throw result; }
  //     const me: ApiMe = authToMe(result);
  //     this.saveAuthentication(me);
  //     this.event.sign_up_success.fire(me);
  //     this.event.authenticated.fire(me);
  //     return result;
  //   }

  //   catch (error) {
  //     // don't clear authentication...
  //     console.warn('SignUp failed', error);
  //     this.event.sign_up_fail.fire(undefined);
  //     throw error;
  //   }

  //   finally {
  //     release?.();
  //   }
  // }


  // /**
  //  * Do refresh
  //  *
  //  * Refresh credentials (requires refresh_token in cookies)
  //  */
  // public async refresh(opts?: { unlocked?: boolean; keepOnFail: boolean }): Promise<IAuthenticationRo> {
  //   const { unlocked, keepOnFail } = opts ?? {};
  //   const release = unlocked ? null : await this.authenticationLock.acquire();
  //   try {
  //     this.event.refresh_start.fire(undefined);
  //     const response = await isoFetch(
  //       `${this.publicEnv.API_URL}/v1/auth/refresh`,
  //       {
  //         credentials: 'include',
  //         mode: 'cors',
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accepts': 'application/json',
  //         },
  //       },
  //     );
  //     const result: IAuthenticationRo = await response.json();
  //     if (!response.ok) { throw result; }
  //     const me: ApiMe = authToMe(result);
  //     this.saveAuthentication(me);
  //     this.event.refresh_success.fire(me);
  //     this.event.authenticated.fire(me);
  //     return result;
  //   }

  //   catch (error) {
  //     console.warn('Refresh failed', error);
  //     if (!keepOnFail) {
  //       this.event.refresh_fail.fire(undefined);
  //       await this.signOut({ unlocked: true });
  //     } else {
  //       this.event.refresh_fail.fire(undefined);
  //     }
  //     throw error;
  //   }

  //   finally {
  //     release?.();
  //   }
  // }



  // /**
  //  * If able, force refreshing
  //  */
  // async forceSync(): Promise<{ authenticated: boolean }> {
  //   const unlock = await this.syncLock.acquire();
  //   Debug.BackendApiCredentials('[forceSync] Force syncing...');
  //   const cred = this._me;

  //   try {
  //     if (!cred) {
  //       return { authenticated: false };
  //     }

  //     // refresh will handle the changing of state
  //     const result = await this.refresh()
  //       .then(() => ({ authenticated: true }))
  //       .catch(() => ({ authenticated: false }));

  //     return result;
  //   }

  //   finally {
  //     unlock();
  //   }
  // }



  // /**
  //  * Make a request, handling credentialing
  //  *
  //  * @param fn
  //  */
  // async graphql<T = any, V = Variables>(doc: RequestDocument, vars: V): Promise<Attempt<T, IApiException>> {
  //   // try
  //   const result = await fn();
  //   if (isSuccess(result)) {
  //     return result;
  //   }

  //   // expect we're unauthenticated? nothing to do
  //   if (!this.isAuthenticated()) {
  //     return result;
  //   }

  //   // expected we're authenticated but result failed...

  //   // 440 - Authentication expired - throw out auth
  //   if (result.value.code === 440) {
  //     this.saveAuthentication(undefined);
  //     this.event.unauthenticated.fire(undefined);
  //   }

  //   // 401 - Unauthenticated - try to refresh & redo
  //   if (result.value.code === 401) {
  //     const unlock = await this.syncLock.acquire();
  //     // TODO: check if we just refreshed credentials already & simply re-send request...
  //     // TODO: have waiters in line....
  //     try {
  //       this.refresh();
  //       const vars: RefreshMutationVariables = { refresh_token: undefined };
  //       const refreshResult = await attemptAsync(
  //         this
  //           .authenticatedGqlClient
  //           .request<RefreshMutation, RefreshMutationVariables>(refreshMutation, vars),
  //         fail,
  //       );
  //       if (isFail(refreshResult)) {
  //         // failed to refresh...
  //         this.saveAuthentication(undefined);
  //         this.event.unauthenticated.fire(undefined);
  //         // return //
  //       }
  //       // TODO: handle success.. re-send request
          

  //     } catch (error) {
  //       this.saveAuthentication(undefined);
  //       this.event.unauthenticated.fire(undefined);
  //     } finally {
  //       unlock();
  //     }
  //   }

  //   // neither 440 or 401, just return failure
  //   return result;
  // }


  // /**
  //  * Refresh credentials if necessary
  //  */
  // async sync(): Promise<{ authenticated: boolean }> {
  //   const unlock = await this.syncLock.acquire();
  //   Debug.BackendApiCredentials('[sync] Syncing...');
  //   const cred = this._me;

  //   try {
  //     // no credentials
  //     if (!cred) {
  //       Debug.BackendApiCredentials('[sync] No credentials');
  //       return { authenticated: false };
  //     }

  //     // fresh access
  //     if (!this._isExpired(cred.access_exp)) {
  //       Debug.BackendApiCredentials('[sync] Credentials are fresh');
  //       return { authenticated: true };
  //     }

  //     // stale access
  //     // attempt to refresh
  //     if (!this._isExpired(cred.refresh_exp)) {
  //       Debug.BackendApiCredentials('[sync] Credentials are expired');
  //       // TODO: refresh with retries...
  //       await this.refresh();
  //       return { authenticated: true };
  //     }

  //     // stale access & stale refresh
  //     // unauthenticate
  //     Debug.BackendApiCredentials('[sync] Credentials are stale... Removing');
  //     this.saveAuthentication(undefined);
  //     this.event.unauthenticated.fire(undefined);
  //     return { authenticated: false };
  //   }

  //   finally {
  //     unlock();
  //   }
  // }


  // /**
  //  * Auto refresh authentication details
  //  *
  //  * @param me
  //  */
  // protected async autoRefresh() {
  //   if (this._me) {
  //     Debug.BackendApiCredentials('auto refreshing credentials...');
  //     // try a few times...
  //     for (let i = 0; i < this.publicEnv.API_AUTH_REFRESH_ATTEMPT_COUNT; i += 1) {
  //       if (i > 0){ 
  //         console.warn(`attempting to refresh again in ${((this.publicEnv.API_AUTH_REFRESH_ATTEMPT_PAUSE_MS / 1000) + 0.5).toFixed(0)}s`)
  //         await wait(this.publicEnv.API_AUTH_REFRESH_ATTEMPT_PAUSE_MS);
  //       }
  //       try {
  //         await this.refresh({ keepOnFail: true });
  //         // success
  //         return;
  //       } catch (error) {
  //         console.warn(`errored refreshing credentials (${i + 1} / ${this.publicEnv.API_AUTH_REFRESH_ATTEMPT_COUNT})`, error);
  //       }
  //     }
  //     // clear auth details
  //     console.warn(`failed to refresh credentials: exceeded retry count..`);
  //     await this.signOut();
  //     this.saveAuthentication(undefined);
  //     this.event.unauthenticated.fire(undefined);
  //   }
  // }


  // /**
  //  * has the expired passed
  //  *
  //  * @param exp
  //  */
  // protected _isExpired(exp: number) {
  //   const now = Date.now();
  //   return now >= exp;
  // }


  // /**
  //  * Save authentication
  //  *
  //  * @param arg
  //  */
  // protected async saveAuthentication(arg?: ApiMe) {
  //   if (arg) { this._me = arg; }
  //   else { this._me = null; }
  // }
}
