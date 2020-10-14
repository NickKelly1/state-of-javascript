import { IAccessTokenDto } from "../../app/auth/dtos/access-token.dto";
import { Permission, PublicPermissions } from "../../app/permission/permission.const";
import { PermissionId } from "../../app/permission/permission-id.type";
import { UserId } from "../../app/user/user.id.type";
import { OrUndefined } from "../types/or-undefined.type";

export class RequestAuth {
  protected _permissions: Set<PermissionId> = new Set(PublicPermissions);

  protected _roles: Set<PermissionId> = new Set();

  protected _user_id: OrUndefined<UserId>;

  get permissions(): Set<PermissionId> { return this._permissions; };

  get roles(): Set<PermissionId> { return this._roles; };

  get user_id(): OrUndefined<PermissionId> { return undefined; };

  hasAnyPermissions(permissions: PermissionId[]): boolean {
    return permissions.some(perm => this.permissions.has(perm));
  }

  hasAllPermissions(permissions: PermissionId[]): boolean {
    return permissions.every(perm => this.permissions.has(perm));
  }

  addAccess(arg: { access: IAccessTokenDto }) {
    const { access } = arg;
    this._user_id = access.user_id;
    access.permissions.forEach(perm => this.permissions.add(perm));
  }
}