import { Mutex, MutexInterface } from 'async-mutex';
import { gql, request } from 'graphql-request';
import { debuglog } from 'util';
import { Debug } from '../debug/debug';
import { PublicEnv } from '../env/public-env.helper';
import {
  AuthLoginMutation,
  AuthLoginMutationVariables,
  AuthSignupMutation,
  AuthSignupMutationVariables,
} from '../generated/graphql';
import { TsEvent } from '../helpers/ts-event';
import { wait } from '../helpers/wait.helper';
import { isoFetch } from '../iso-fetch';
import { $FIXME } from '../types/$fix-me.type';
import { OrNull } from '../types/or-null.type';

export interface IAuthenticationRo {
  access_token: string;
  refresh_token: string;
  access_token_object: {
    user_id: number;
    permissions: number[];
    iat: string;
    exp: string;
  },
  refresh_token_object: {
    user_id: number;
    iat: string;
    exp: string;
  };
  user: {
    name: string;
  };
}

export interface IMe {
  user_id: number;
  permissions: number[];
  access_exp: number;
  refresh_exp: number;
  name: string;
}

function authToMe(auth: IAuthenticationRo): IMe {
  return {
    permissions: auth.access_token_object.permissions,
    user_id: auth.access_token_object.user_id,
    access_exp: Number(auth.access_token_object.exp),
    refresh_exp: Number(auth.refresh_token_object.exp),
    name: auth.user.name,
  };
}

const AuthSignup = gql`
mutation AuthSignup(
  $name:String!
  $password:String!
){
  signup(
    dto:{
      name:$name
      password:$password
    }
  ){
    access_token
    refresh_token
    access_token_object{
      user_id
      permissions
      iat
      exp
    }
    refresh_token_object{
      user_id
      iat
      exp
    }
  }
}
`

const AuthLogin = gql`
mutation AuthLogin(
  $name:String!
  $password:String!
){
  login(
    dto:{
      name:$name
      password:$password
    }
  ){
    access_token
    refresh_token
    access_token_object{
      user_id
      permissions
      iat
      exp
    }
    refresh_token_object{
      user_id
      iat
      exp
    }
  }
}
`

export class ApiCredentials {
  protected readonly syncLock: Mutex = new Mutex();
  protected readonly authenticationLock: Mutex = new Mutex();

  protected _me: OrNull<IMe> = null;
  get me(): OrNull<IMe> { return this._me; }

  public readonly event = {
    authenticated: new TsEvent<IMe>(),
    unauthenticated: new TsEvent<undefined>(),

    sign_out_start: new TsEvent<undefined>(),
    sign_out_success: new TsEvent<undefined>(),
    sign_out_fail: new TsEvent<undefined>(),

    sign_in_start: new TsEvent<undefined>(),
    sign_in_success: new TsEvent<IMe>(),
    sign_in_fail: new TsEvent<undefined>(),

    sign_up_start: new TsEvent<undefined>(),
    sign_up_success: new TsEvent<IMe>(),
    sign_up_fail: new TsEvent<undefined>(),

    refresh_start: new TsEvent<undefined>(),
    refresh_success: new TsEvent<IMe>(),
    refresh_fail: new TsEvent<undefined>(),
  } as const;

  protected autoRefreshTimeout: OrNull<ReturnType<typeof setTimeout>> = null;


  constructor(
    protected readonly publicEnv: PublicEnv,
  ) {
    this.event.authenticated.on(() => { Debug.BackendApiCredentials('on::authenticated'); });
    this.event.unauthenticated.on(() => { Debug.BackendApiCredentials('on::unauthenticated'); });
    this.event.sign_in_start.on(() => { Debug.BackendApiCredentials('on::sign_in_start'); });
    this.event.sign_in_success.on(() => { Debug.BackendApiCredentials('on::sign_in_success'); });
    this.event.sign_in_fail.on(() => { Debug.BackendApiCredentials('on::sign_in_fail'); });
    this.event.sign_up_start.on(() => { Debug.BackendApiCredentials('on::sign_up_start'); });
    this.event.sign_up_fail.on(() => { Debug.BackendApiCredentials('on::sign_up_fail'); });
    this.event.refresh_start.on(() => { Debug.BackendApiCredentials('on::refresh_start'); });
    this.event.refresh_success.on(() => { Debug.BackendApiCredentials('on::refresh_success'); });
    this.event.refresh_fail.on(() => { Debug.BackendApiCredentials('on::refresh_fail'); });

    this.event.authenticated.on(this.handleAuthenticated.bind(this));
    this.event.unauthenticated.on(this.handleUnauthenticated.bind(this));
  }


  /**
   * Fired when becoming unauthenticated
   */
  protected handleUnauthenticated() {
    if (this.autoRefreshTimeout !== null) {
      clearTimeout(this.autoRefreshTimeout);
    }
  }


  /**
   * Fired when becoming authenticated
   * 
   * @param me
   */
  protected handleAuthenticated(me: IMe) {
    // minimum refresh 10 sec
    const min = 1000 * 10;
    // 20 sec leeway (refresh before before access_token expiry)
    const leeway = this.publicEnv.API_AUTH_REFRESH_LEEWAY_MS;
    let refreshAfter = (me.access_exp - leeway) - Date.now();
    if (refreshAfter < min) {
      console.warn(`refreshAfter (${refreshAfter}) < min (${min})... setting to ${min}`);
      refreshAfter = min;
    }
    Debug.BackendApiCredentials(`refreshing credentials after ${refreshAfter} ${((refreshAfter / 1000) + 0.5).toFixed(0)}s...`);
    if (this.autoRefreshTimeout !== null) { clearTimeout(this.autoRefreshTimeout); }
    this.autoRefreshTimeout = setTimeout(this.autoRefresh.bind(this), refreshAfter);
  }


  /**
   * Auto refresh authentication details
   *
   * @param me
   */
  protected async autoRefresh() {
    if (this._me) {
      Debug.BackendApiCredentials('auto refreshing credentials...');
      // try a few times...
      for (let i = 0; i < this.publicEnv.API_AUTH_REFRESH_ATTEMPT_COUNT; i += 1) {
        if (i > 0){ 
          console.warn(`attempting to refresh again in ${((this.publicEnv.API_AUTH_REFRESH_ATTEMPT_PAUSE_MS / 1000) + 0.5).toFixed(0)}s`)
          await wait(this.publicEnv.API_AUTH_REFRESH_ATTEMPT_PAUSE_MS);
        }
        try {
          await this.refresh({ keepOnFail: true });
          // success
          return;
        } catch (error) {
          console.warn(`errored refreshing credentials (${i + 1} / ${this.publicEnv.API_AUTH_REFRESH_ATTEMPT_COUNT})`, error);
        }
      }
      // clear auth details
      console.warn(`failed to refresh credentials: exceeded retry count..`);
      await this.signOut();
      this.saveAuthentication(undefined);
      this.event.unauthenticated.fire(undefined);
    }
  }


  /**
   * has the expired passed
   *
   * @param exp
   */
  protected _isExpired(exp: number) {
    const now = Date.now();
    return now >= exp;
  }


  /**
   * Save authentication
   *
   * @param arg
   */
  protected async saveAuthentication(arg?: IMe) {
    if (arg) { this._me = arg; }
    else { this._me = null; }
  }


  /**
   * Sign out
   */
  async signOut(opts?: { unlocked?: boolean }): Promise<null> {
    const { unlocked } = opts ?? {};
    const release = unlocked ? null : await this.authenticationLock.acquire();
    if (this.autoRefreshTimeout) clearTimeout(this.autoRefreshTimeout);

    try {
      this.event.sign_out_start.fire(undefined);
      const response = await isoFetch(
        'http://localhost:4000/v1/auth/signout',
        {
          credentials: 'include',
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json',
          },
        },
      );
      const result: null = await response.json();
      if (!response.ok) { throw result; }
      this.saveAuthentication(undefined);
      this.event.sign_out_success.fire(undefined);
      this.event.unauthenticated.fire(undefined);
      return result;
    }

    catch (error) {
      this.saveAuthentication(undefined);
      this.event.sign_in_fail.fire(undefined);
      this.event.unauthenticated.fire(undefined);
      throw error;
    }

    finally {
      release?.();
    }
  }


  /**
   * Do sign in
   *
   * @param arg
   */
  async signIn(
    props: { name: string; password: string },
    opts?: { unlocked?: boolean; },
  ): Promise<IAuthenticationRo> {
    const { name, password } = props
    const { unlocked } = opts ?? {};
    const release = unlocked ? null : await this.authenticationLock.acquire();

    try {
      this.event.sign_in_start.fire(undefined);
      const response = await isoFetch(
        'http://localhost:4000/v1/auth/signin',
        {
          credentials: 'include',
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json',
          },
          body: JSON.stringify({ name, password }),
        },
      );
      const result: IAuthenticationRo = await response.json();
      if (!response.ok) { throw result; }
      const me: IMe = authToMe(result);
      this.saveAuthentication(me);
      this.event.sign_in_success.fire(me);
      this.event.authenticated.fire(me);
      return result;
    }

    catch (error) {
      // don't clear authentication...
      this.event.sign_in_fail.fire(undefined);
      throw error;
    }

    finally {
      release?.();
    }
  }


  /**
   * Do sign up
   * 
   * Server will save access_token and refresh_token in cookies
   *
   * @param arg
   */
  async signUp(
    props: { name: string, password: string, },
    opts?: { unlocked?: boolean; },
  ): Promise<IAuthenticationRo> {
    const { name, password } = props;
    const { unlocked } = opts ?? {};
    const release = unlocked ? null : await this.authenticationLock.acquire();
    try {
      this.event.sign_up_start.fire(undefined);
      const response = await isoFetch(
        'http://localhost:4000/v1/auth/signup',
        {
          credentials: 'include',
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json',
          },
          body: JSON.stringify({ name, password }),
        },
      );
      const result: IAuthenticationRo = await response.json();
      if (!response.ok) { throw result; }
      const me: IMe = authToMe(result);
      this.saveAuthentication(me);
      this.event.sign_up_success.fire(me);
      this.event.authenticated.fire(me);
      return result;
    }

    catch (error) {
      // don't clear authentication...
      this.event.sign_up_fail.fire(undefined);
      throw error;
    }

    finally {
      release?.();
    }
  }


  /**
   * Do refresh
   *
   * Refresh credentials (requires refresh_token in cookies)
   */
  public async refresh(opts?: { unlocked?: boolean; keepOnFail: boolean }): Promise<IAuthenticationRo> {
    const { unlocked, keepOnFail } = opts ?? {};
    const release = unlocked ? null : await this.authenticationLock.acquire();
    try {
      this.event.refresh_start.fire(undefined);
      const response = await isoFetch(
        'http://localhost:4000/v1/auth/refresh',
        {
          credentials: 'include',
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json',
          },
        },
      );
      const result: IAuthenticationRo = await response.json();
      if (!response.ok) { throw result; }
      const me: IMe = authToMe(result);
      this.saveAuthentication(me);
      this.event.refresh_success.fire(me);
      this.event.authenticated.fire(me);
      return result;
    }

    catch (error) {
      if (!keepOnFail) {
        this.event.refresh_fail.fire(undefined);
        await this.signOut({ unlocked: true });
      } else {
        this.event.refresh_fail.fire(undefined);
      }
      throw error;
    }

    finally {
      release?.();
    }
  }


  /**
   * If able, force refreshing
   */
  async forceSync(): Promise<{ authenticated: boolean }> {
    const unlock = await this.syncLock.acquire();
    Debug.BackendApiCredentials('[forceSync] Force syncing...');
    const cred = this._me;

    try {
      if (!cred) {
        return { authenticated: false };
      }

      // refresh will handle the changing of state
      const result = await this.refresh()
        .then(() => ({ authenticated: true }))
        .catch(() => ({ authenticated: false }));

      return result;
    }

    finally {
      unlock();
    }
  }


  /**
   * Refresh credentials if necessary
   */
  async sync(): Promise<{ authenticated: boolean }> {
    const unlock = await this.syncLock.acquire();
    Debug.BackendApiCredentials('[sync] Syncing...');
    const cred = this._me;

    try {
      // no credentials
      if (!cred) {
        Debug.BackendApiCredentials('[sync] No credentials');
        return { authenticated: false };
      }

      // fresh access
      if (!this._isExpired(cred.access_exp)) {
        Debug.BackendApiCredentials('[sync] Credentials are fresh');
        return { authenticated: true };
      }

      // stale access
      // attempt to refresh
      if (!this._isExpired(cred.refresh_exp)) {
        Debug.BackendApiCredentials('[sync] Credentials are expired');
        // TODO: refresh with retries...
        await this.refresh();
        return { authenticated: true };
      }

      // stale access & stale refresh
      // unauthenticate
      Debug.BackendApiCredentials('[sync] Credentials are stale... Removing');
      this.saveAuthentication(undefined);
      this.event.unauthenticated.fire(undefined);
      return { authenticated: false };
    }

    finally {
      unlock();
    }
  }
}