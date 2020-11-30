import { ist } from "../helpers/ist.helper";
import { nanoid } from 'nanoid';
import { Id } from "../types/id.type";
import { AuthenticationFieldsFragment, AuthorisedActionsFieldsFragment } from '../generated/graphql';
import objectHash from 'object-hash';
import { OrNull } from "../types/or-null.type";
import { IApiMeSerialized } from "../types/api-me-serialized.hinterface";
import { IJson } from "../types/json.interface";
import { _ls } from "../helpers/_ls.helper";
import { shad_id } from "../constants/shad-id.const";
import { $FIXME } from "../types/$fix-me.type";


export interface IMeUserData { id: number; name: string; access_token: string; refresh_token: string; };
export interface IMeHash { id?: Id; permissions: number[]; }
let instanceCounter = 0;
export interface IApiMe {
  shad_id: string;
  instance: number;
  createdAt: Date;
  user: null | IMeUserData;
  permissions: number[];
  permission_set: Set<number>;
  hash: string;
  can: AuthorisedActionsFieldsFragment;
  ss: boolean;
}
export const apiMeFns = {
  /**
   * Find a shadow_id
   */
  findShadowId(): string {
    let shadow_id = _ls?.getItem(shad_id);
    if (!shadow_id) {
      shadow_id = nanoid();
      _ls?.setItem(shad_id, shadow_id);
    }
    return shadow_id;
  },

  /**
   * Serialize a user
   *
   * @param me
   */
  serialize(me: IApiMe): IApiMeSerialized {
    // do not serialize shadow_id
    const serialized = {
      createdAt: me.createdAt.valueOf(),
      instance: me.instance,
      can: me.can,
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
    const { instance, createdAt, user, permissions, can, } = serialized;
    const sortedPermissions = serialized.permissions.sort((a, b) => a - b);

    const shad_id = apiMeFns.findShadowId();
    const me: IApiMe = {
      instance: instance ?? (instanceCounter + 1),
      createdAt: new Date(createdAt),
      user: user,
      permission_set: new Set(sortedPermissions),
      permissions: sortedPermissions,
      can,
      shad_id,
      hash: objectHash({
        user_id: serialized.user?.id ?? null,
        permissions: sortedPermissions,
        can: serialized.can,
        shad_id,
      })
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
      shad_id: me.shad_id,
      isAuthenticated: apiMeFns.isAuthenticated(me),
      instance: me.instance,
      createdAt: me.createdAt.valueOf(),
      hash: me.hash,
      can: me.can,
      permissions: me.permissions,
    };
  },
}
