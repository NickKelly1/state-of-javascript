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

type IAuthenticatedMeFactoryArg =
  { authenticated: true, value: AuthenticationFieldsFragment }
  | { authenticated: false, value: AuthorisedActionsFieldsFragment };


/**
 * Create Me
 *
 * @param arg
 */
export function ApiMeFactory(arg: IAuthenticatedMeFactoryArg): ApiMe {
  if (arg.authenticated) {
    const me = new ApiMe({
      createdAt: new Date(),
      can: arg.value.can,
      permissions: arg.value.access_token_object.data.permissions,
      user: {
        id: arg.value.user_id,
        name: arg.value.user_name,
        access_token: arg.value.access_token,
        refresh_token: arg.value.refresh_token,
      },
    });
    return me;
  }

  const me = new ApiMe({
    createdAt: new Date(),
    can: arg.value,
    permissions: [],
    user: null,
  });
  return me;
}


export interface IMeHash { id?: Id; permissions: number[]; }

let instanceCounter = 0;

export class ApiMe {
  public readonly [shad_id]: OrNull<string> = null;

  protected readonly instance: number;
  public readonly createdAt: Date;
  public readonly user: null | IMeUserData;
  public readonly permissions: number[];
  public readonly permission_set: Set<number>;
  public readonly hash: string;
  public readonly can: AuthorisedActionsFieldsFragment;


  /**
   * Deserialize me
   *
   * @param arg
   */
  static deserialize(arg: IApiMeSerialized): ApiMe {
    const api = new ApiMe({
      // do not serialize shadow_id
      can: arg.can,
      createdAt: new Date(arg.createdAt),
      permissions: arg.permissions,
      user: arg.user,
    });
    return api;
  }


  /**
   * Serialize Me
   */
  serialize(): IApiMeSerialized {
    const ser = {
      // do not serialize shadow_id
      createdAt: this.createdAt.valueOf(),
      can: this.can,
      permissions: this.permissions,
      user: this.user,
      instance: this.instance,
    };
    return ser;
  }


  constructor(arg: {
    instance?: number;
    createdAt: Date;
    user: null | IMeUserData;
    permissions: number[];
    can: AuthorisedActionsFieldsFragment;
  }) {
    const { instance, createdAt, user, permissions, can, } = arg;
    this.instance = instance ?? (instanceCounter + 1);
    instanceCounter = this.instance;
    this.createdAt = createdAt;
    this.user = arg.user;
    this.permission_set = new Set(permissions);
    this.permissions = Array.from(this.permission_set).sort((a, b) => a - b);
    this.can = can;

    if (ist.nullable(this.user)) {
      // use a shadow id
      if (ist.defined(_ls)) {
        // exists?
        let shadow_id = _ls.getItem(shad_id);
        if (!shadow_id) {
          // create
          shadow_id = nanoid();
          _ls.setItem(shad_id, shadow_id);
        }
        this[shad_id] = shadow_id;
      }
    }

    this.hash = objectHash({
      user_id: this.user?.id ?? null,
      permissions: this.permissions,
      can: this.can,
      [shad_id]: this[shad_id],
    });
  }


  /**
   * Are these instances eq?
   *
   * Doing this instead of == / === for flexibility...
   *
   * @param me
   */
  eqInstance(me: ApiMe) { return this.instance === instanceCounter; }


  /**
   * Am I this user?
   *
   * @param user_id
   */
  is(user_id: number): boolean {
    if (ist.nullable(this.user?.id)) return false;
    return Number(this.user?.id) === Number(user_id);
  }

  /**
   * Am I Authenticated?
   */
  get isAuthenticated(): boolean { return ist.defined(this.user); }
  /**
   * My UserId
   */
  get id(): OrNull<number> { return this.user?.id ?? null; }
  /**
   * My UserName
   */
  get name(): OrNull<string> { return this.user?.name ?? null; }

  /**
   * Do I have any of these permissions?
   *
   * @param perms
   */
  hasSomePermissions(perms: number[]): boolean {
    return perms.some(this.permission_set.has.bind(this.permission_set))
  }

  /**
   * Do I have all of these permissions?
   *
   * @param perms
   */
  hasEveryPermissions(perms: number[]): boolean {
    return perms.every(this.permission_set.has.bind(this.permission_set))
  }


  /**
   * @inheritdoc
   */
  toJSON(): IJson {
    return {
      user: this.user as $FIXME<unknown> as IJson,
      shad_id: this[shad_id],
      isAuthenticated: this.isAuthenticated,
      instance: this.instance,
      createdAt: this.createdAt.valueOf(),
      hash: this.hash,
      can: this.can,
      permissions: this.permissions,
    };
  }
}
