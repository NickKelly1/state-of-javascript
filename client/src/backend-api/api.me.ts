import * as cookie from 'cookie';
import { ist } from "../helpers/ist.helper";
import { nanoid } from 'nanoid';
import { Id } from "../types/id.type";
import { AuthenticationFieldsFragment, AuthorisedActionsFieldsFragment, LoginMutation } from '../generated/graphql';
import objectHash from 'object-hash';
import { OrNull } from "../types/or-null.type";
import { IApiMeSerialized } from "../types/api-me-serialized.hinterface";
import { IJson } from "../types/json.interface";
import { _ls } from "../helpers/_ls.helper";
import { $FIXME } from "../types/$fix-me.type";
import { TsEvent } from "../helpers/ts-event";
import { Action, configureStore, createEntityAdapter, createSelector, createSlice, PayloadAction, PayloadActionCreator,  } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { useMemo, useRef, useState } from "react";
import { Mutex } from "async-mutex";
import { useRowSelect } from "react-table";
import { _cookie_shad_id_key, _ls_shad_id_key } from "../constants/shad-id.const";


export interface IMeUserData { id: number; name: string; access_token: string; refresh_token: string; };
export interface IMeHash { id?: Id; permissions: number[]; }
export interface IApiMe {
  shadow_id: string,
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
    shadow_id: string;
    permissions: number[];
    can: OrNull<AuthorisedActionsFieldsFragment>;
  }): string {
    const { shadow_id, permissions, can } = arg;
    return objectHash({
      shadow_id,
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
    const shadow_id: string = apiMeFns.findShadowId();
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
      shadow_id,
      ss,
      isAuthenticated: true,
      hash: apiMeFns.createHash({
        shadow_id,
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
  }) => {
    const { can, ss } = arg;
    const permissions: number[] = [];
    const permissions_set: Set<number> = new Set(permissions);
    const shadow_id: string = apiMeFns.findShadowId();
    const next: IApiMe = {
      can,
      permissions,
      user: null,
      permissions_set,
      shadow_id,
      ss,
      isAuthenticated: false,
      hash: apiMeFns.createHash({
        shadow_id,
        can,
        permissions,
      }),
    };
    return next;
  },


  /**
   * Find a shadow_id
   */
  findShadowId(): string {
    // browser?
    // server
    let shadow_id = _ls?.getItem(_ls_shad_id_key);
    if (!shadow_id) {
      shadow_id = nanoid();
      _ls?.setItem(_ls_shad_id_key, shadow_id);
    }
    if (process.browser && typeof document !== 'undefined' && document.cookie) {
      console.log('setting shad_id for browser..............', shadow_id);
      // set shadow_id for frontend-server
      document.cookie = cookie.serialize(_cookie_shad_id_key, shadow_id, {
        // domain: document.domain,
        // 1 year
        maxAge: 1_000 * 60 * 60 * 24 * 356,
        httpOnly: false,
        sameSite: 'strict',
      });
    }
    return shadow_id;
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
    const shadow_id: string = apiMeFns.findShadowId();
    const ss: boolean = serialized.ss;
    const me: IApiMe = {
      user: user,
      permissions,
      permissions_set,
      can,
      shadow_id,
      ss,
      isAuthenticated: !!user,
      hash: apiMeFns.createHash({
        can,
        permissions,
        shadow_id,
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
      shadow_id: me.shadow_id,
      isAuthenticated: me.isAuthenticated,
      hash: me.hash,
      can: me.can,
      permissions: me.permissions,
    };
  },
}
