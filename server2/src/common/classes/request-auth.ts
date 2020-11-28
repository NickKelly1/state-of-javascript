import { PermissionId } from "../../app/permission/permission-id.type";
import { UserId } from "../../app/user/user.id.type";
import { OrUndefined } from "../types/or-undefined.type";
import { IAccessToken } from "../../app/auth/token/access.token.gql";
import { UserModel } from "../../circle";
import { ist } from "../helpers/ist.helper";
import { OrNull } from "../types/or-null.type";
import { shad_id } from "../constants/shad.const";
import { OrNullable } from "../types/or-nullable.type";

export class RequestAuth {
  protected _permissions: Set<PermissionId>;

  protected _user_id: OrUndefined<UserId>;

  get permissions(): Set<PermissionId> { return this._permissions; };

  get user_id(): OrUndefined<PermissionId> { return this._user_id; };

  readonly shadow_id: OrNull<string> = null;

  constructor(
    permissions: PermissionId[],
    user_id?: UserId,
    shad_id?: OrNull<string>,
  ) {
    this._permissions = new Set(permissions);
    this._user_id = user_id;
    // null out an empty string shadow_id
    this.shadow_id = shad_id || null;
  }

  /**
   * Is the Request authenticated as either User or Shadow?
   */
  isAuthenticatedAsAny(): boolean {
    return this.isAuthenticatedAsUser() || this.isAuthenticatedAsShadow();
  }

  /**
   * Is the Request authenticated as a Shadow?
   */
  isAuthenticatedAsShadow(): boolean {
    return ist.defined(this.shadow_id);
  }

  /**
   * Is the Request authenticated as a User?
   */
  isAuthenticatedAsUser(): boolean {
    return ist.defined(this.user_id);
  }


  /**
   * Is a given User the Requester?
   *
   * @param user
   */
  isMe(user: OrNullable<UserModel>): boolean {
    if (ist.nullable(user)) return false;
    if (ist.nullable(this.user_id)) return false;
    return this.isMeByUserId(user.id);
  }


  /**
   * Does a given UserId belong to the Requester?
   *
   * @param id
   */
  isMeByUserId(id: OrNullable<UserId>): boolean {
    if (ist.nullable(id)) return false;
    if (ist.nullable(this.user_id)) return false;
    return this.user_id === id;
  }


  /**
   * Does a given ShadowId belong to the Requester?
   *
   * @param id
   */
  isMeByShadowId(shadow_id: OrNullable<string>): boolean {
    // if shadow id === empty string -> kill
    if (!shadow_id) return false;
    if (ist.nullable(this.shadow_id)) return false;
    return this.shadow_id === shadow_id;
  }


  /**
   * Does the Requester have any of the given Permissions?
   *
   * @param permissions
   */
  hasAnyPermissions(permissions: PermissionId[]): boolean {
    return permissions.some(perm => this.permissions.has(perm));
  }


  /**
   * Does the Requester have all of the given Permissions?
   *
   * @param permissions
   */
  hasAllPermissions(permissions: PermissionId[]): boolean {
    return permissions.every(perm => this.permissions.has(perm));
  }


  /**
   * Bind Authorisation to the Request
   *
   * @param arg
   */
  addAccess(arg: { access: IAccessToken }) {
    const { access } = arg;
    this._user_id = access.user_id;
    access.permissions.forEach(perm => this.permissions.add(perm));
  }


  /**
   * Add Permissions to the Request
   *
   * @param arg
   */
  addPermissions(arg: { permissions: PermissionId[] }) {
    const { permissions } = arg;
    permissions.forEach(this._permissions.add.bind(this._permissions));
  }
}