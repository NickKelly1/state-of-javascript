import * as cookie from 'cookie';
import { ist } from "../helpers/ist.helper";
import { nanoid } from 'nanoid';
import { Id } from "../types/id.type";
import { AuthenticationFieldsFragment, AuthorisedActionsFieldsFragment, } from '../generated/graphql';
import objectHash from 'object-hash';
import { OrNull } from "../types/or-null.type";
import { IApiMeSerialized } from "../types/api-me-serialized.hinterface";
import { IJson } from "../types/json.interface";
import { _ls } from "../helpers/_ls.helper";
import { $FIXME } from "../types/$fix-me.type";
import { _cookie_aid_key, _ls_aid_key } from "../constants/aid.const";


export interface IMeUserData { id: number; name: string; access_token: string; refresh_token: string; }
export interface IMeHash { id?: Id; permissions: number[]; }
export interface IApiMe {
  aid: string,
  user: OrNull<IMeUserData>,
  permissions: number[];
  permissions_set: Set<number>;
  hash: string;
  can: OrNull<AuthorisedActionsFieldsFragment>;
  ss: boolean;
  isAuthenticated: boolean;
}


export const apiMeFns = {
  /**
   * Get the default initial IApiMe
   *
   * @param arg
   */
  defaultInitialMe(arg: { ss: boolean }): IApiMe {
    const { ss } = arg;
    return apiMeFns.deserialise({
      can: null,
      permissions: [],
      ss,
      user: null,
    });
  },

  /**
   * Sort Permissions
   *
   * @param a
   * @param b
   */
  sortPermissions(a: number, b: number): number { return (a - b) },

  /**
   * Create a hash
   *
   * @param arg
   */
  createHash(arg: {
    aid: string;
    permissions: number[];
    can: OrNull<AuthorisedActionsFieldsFragment>;
  }): string {
    const { aid, permissions, can } = arg;
    return objectHash({
      aid,
      permissions,
      can,
    });
  },

  /**
   * Authenticate
   */
  authenticate: (arg: {
    authentication: AuthenticationFieldsFragment;
    ss: boolean;
  }): IApiMe => {
    const { authentication, ss } = arg;
    const permissions: number[] = Array.from(authentication.access_token_object.data.permissions).sort(apiMeFns.sortPermissions);
    const permissions_set: Set<number> = new Set(permissions);
    const can: AuthorisedActionsFieldsFragment = authentication.can;
    const aid: string = apiMeFns.findAId();
    const next: IApiMe = {
      can,
      permissions,
      user: {
        id: authentication.user_id,
        name: authentication.user_name,
        access_token: authentication.access_token,
        refresh_token: authentication.refresh_token,
      },
      permissions_set,
      aid,
      ss,
      isAuthenticated: true,
      hash: apiMeFns.createHash({
        aid: aid,
        can,
        permissions,
      }),
    };
    return next;
  },


  /**
   * Unauthenticate
   */
  unauthenticate: (arg: {
    can: OrNull<AuthorisedActionsFieldsFragment>;
    ss: boolean;
  }): IApiMe => {
    const { can, ss } = arg;
    const permissions: number[] = [];
    const permissions_set: Set<number> = new Set(permissions);
    const aid: string = apiMeFns.findAId();
    const next: IApiMe = {
      can,
      permissions,
      user: null,
      permissions_set,
      aid,
      ss,
      isAuthenticated: false,
      hash: apiMeFns.createHash({
        aid,
        can,
        permissions,
      }),
    };
    return next;
  },


  /**
   * Find a aid
   */
  findAId(): string {
    // browser?
    // server
    let aid = _ls?.getItem(_ls_aid_key);
    if (!aid) {
      aid = nanoid();
      _ls?.setItem(_ls_aid_key, aid);
    }
    if (process.browser && typeof document !== 'undefined' && document.cookie) {
      console.log('setting aid for browser...', aid);
      // set aid for frontend-server
      document.cookie = cookie.serialize(_cookie_aid_key, aid, {
        // domain: document.domain,
        // 1 year
        maxAge: 1_000 * 60 * 60 * 24 * 356,
        httpOnly: false,
        sameSite: 'strict',
      });
    }
    return aid;
  },


  /**
   * Serialize a user
   *
   * @param me
   */
  serialize(me: IApiMe): IApiMeSerialized {
    const serialized: IApiMeSerialized = {
      can: me.can,
      ss: me.ss,
      permissions: me.permissions,
      user: me.user,
    };
    return serialized;
  },


  /**
   * Deserialize into a user
   *
   * @param serialized
   */
  deserialise(serialized: IApiMeSerialized): IApiMe {
    const permissions: number[] = Array.from(serialized.permissions).sort(apiMeFns.sortPermissions);
    const permissions_set: Set<number> = new Set(permissions);
    const can: OrNull<AuthorisedActionsFieldsFragment> = serialized.can;
    const user: OrNull<IMeUserData> = serialized.user;
    const aid: string = apiMeFns.findAId();
    const ss: boolean = serialized.ss;
    const me: IApiMe = {
      user: user,
      permissions,
      permissions_set,
      can,
      aid,
      ss,
      isAuthenticated: !!user,
      hash: apiMeFns.createHash({
        can,
        permissions,
        aid,
      }),
    };
    return me;
  },


  /**
   * Is the user authenticated?
   *
   * @param me
   */
  isAuthenticated(me: IApiMe) { return ist.defined(me.user); },


  /**
   * Transform the user to json
   */
  toJSON(me: IApiMe): IJson {
    return {
      user: me.user as $FIXME<unknown> as IJson,
      aid: me.aid,
      isAuthenticated: me.isAuthenticated,
      hash: me.hash,
      can: me.can,
      permissions: me.permissions,
    };
  },
}
