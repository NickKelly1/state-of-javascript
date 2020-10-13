import { Permission, PublicPermissions } from "../../app/permission/constants/permission.const";
import { PermissionId } from "../../app/permission/types/permission-id.type";
import { OrUndefined } from "../types/or-undefined.type";

export class RequestAuth {
  _permissions: Set<PermissionId> = new Set(PublicPermissions);

  _roles: Set<PermissionId> = new Set();

  get permissions(): Set<PermissionId> { return this._permissions; };

  get roles(): Set<PermissionId> { return this._roles; };

  get user_id(): OrUndefined<PermissionId> { return undefined; };

  hasAnyPermissions(permissions: PermissionId[]): boolean {
    return permissions.some(perm => this.permissions.has(perm));
  }

  hasAllPermissions(permissions: PermissionId[]): boolean {
    return permissions.every(perm => this.permissions.has(perm));
  }
}