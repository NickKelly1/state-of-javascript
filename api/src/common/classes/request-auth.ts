import { PermissionId } from "../../app/permission/permission-id.type";
import { UserId } from "../../app/user/user.id.type";
import { OrUndefined } from "../types/or-undefined.type";
import { IAccessToken } from "../../app/auth/token/access.token.gql";
import { UserModel } from "../../circle";
import { ist } from "../helpers/ist.helper";
import { OrNull } from "../types/or-null.type";
import { OrNullable } from "../types/or-nullable.type";
import { Permission } from "../../app/permission/permission.const";
import { IJson } from "../interfaces/json.interface";

export class RequestAuth {
  protected _permissions: Set<PermissionId>;

  protected _user_id: OrUndefined<UserId>;

  get permissions(): Set<PermissionId> { return this._permissions; }

  get user_id(): OrUndefined<PermissionId> { return this._user_id; }

  readonly aid: OrNull<string> = null;

  constructor(
    permissions: PermissionId[],
    user_id?: UserId,
    aid?: OrNull<string>,
  ) {
    this._permissions = new Set(permissions);
    this._user_id = user_id;
    // null out an empty string aid
    this.aid = aid || null;
  }

  /**
   * Is the Request authenticated as either User or Shadow?
   */
  isAuthenticatedAsAny(): boolean {
    return this.isLoggedIn() || this.isAuthenticatedAsAnonymous();
  }

  /**
   * Is the Request authenticated as a Shadow?
   */
  isAuthenticatedAsAnonymous(): boolean {
    return ist.defined(this.aid);
  }

  /**
   * Is the Request authenticated as a User?
   */
  isLoggedIn(): boolean {
    return ist.defined(this.user_id);
  }


  /**
   * Is a given User the Requester?
   *
   * @param user
   */
  isMe(user?: OrNullable<UserModel>): boolean {
    if (ist.nullable(user)) return false;
    if (ist.nullable(this.user_id)) return false;
    return this.isMeById(user.id);
  }


  /**
   * Does a given UserId belong to the Requester?
   *
   * @param id
   */
  isMeById(id?: OrNullable<UserId>): boolean {
    if (ist.nullable(id)) return false;
    if (ist.nullable(this.user_id)) return false;
    return this.user_id === id;
  }


  /**
   * Does a given AId belong to the Requester?
   *
   * @param id
   */
  isMeByAId(aid: OrNullable<string>): boolean {
    // if aid === empty string -> kill
    if (!aid) return false;
    if (ist.nullable(this.aid)) return false;
    return this.aid === aid;
  }


  /**
   * Does the request have SuperAdmin authentication?
   */
  isSuperAdmin(): boolean {
    return this.permissions.has(Permission.SuperAdmin.SuperAdmin);
  }


  /**
   * Does the Requester have any of the given Permissions?
   *
   * @param permissions
   */
  hasPermission(...permissions: (PermissionId | PermissionId[])[]): boolean {
    // SuperAdmin has every Permission
    if (this.isSuperAdmin()) return true;

    // Check if has the requisite Permissions
    return permissions.some(permissionOrArray => Array.isArray(permissionOrArray)
      ? permissionOrArray.some(permission => this.permissions.has(permission))
      : this.permissions.has(permissionOrArray)
    );
  }


  // /**
  //  * Does the Requester have all of the given Permissions?
  //  *
  //  * @param permissions
  //  */
  // hasAllPermissions(permissions: PermissionId[]): boolean {
  //   return permissions.every(perm => this.permissions.has(perm));
  // }


  /**
   * Bind Authorisation to the Request
   *
   * @param arg
   */
  addAccess(arg: { access: IAccessToken }): void {
    const { access } = arg;
    this._user_id = access.user_id;
    access.permissions.forEach(perm => this.permissions.add(perm));
  }


  /**
   * Add Permissions to the Request
   *
   * @param arg
   */
  addPermissions(arg: { permissions: PermissionId[] }): void {
    const { permissions } = arg;
    permissions.forEach(this._permissions.add.bind(this._permissions));
  }


  /**
   * to JSON
   */
  toJSON(): IJson {
    const {
      user_id,
      aid,
      permissions,
    } = this;
    return {
      user_id,
      aid,
      permissions: Array.from(permissions),
    };
  }
}