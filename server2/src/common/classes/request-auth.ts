import { PermissionId } from "../../app/permission/permission-id.type";
import { UserId } from "../../app/user/user.id.type";
import { OrUndefined } from "../types/or-undefined.type";
import { IAccessToken } from "../../app/auth/token/access.token.gql";
import { UserModel } from "../../circle";
import { ist } from "../helpers/ist.helper";

export class RequestAuth {
  protected _permissions: Set<PermissionId>;

  protected _user_id: OrUndefined<UserId>;

  get permissions(): Set<PermissionId> { return this._permissions; };

  get user_id(): OrUndefined<PermissionId> { return this._user_id; };

  constructor(permissions: PermissionId[], user_id?: UserId) {
    this._permissions = new Set(permissions);
    this._user_id = user_id;
  }

  isMe(user: UserModel): boolean {
    if (ist.nullable(this.user_id)) return false;
    return this.isMeByUserId(user.id);
  }

  isMeByUserId(id: UserId): boolean {
    if (ist.nullable(this.user_id)) return false;
    return this.user_id === id;
  }


  hasAnyPermissions(permissions: PermissionId[]): boolean {
    return permissions.some(perm => this.permissions.has(perm));
  }

  hasAllPermissions(permissions: PermissionId[]): boolean {
    return permissions.every(perm => this.permissions.has(perm));
  }

  addAccess(arg: { access: IAccessToken }) {
    const { access } = arg;
    this._user_id = access.user_id;
    access.permissions.forEach(perm => this.permissions.add(perm));
  }

  addPermissions(arg: { permissions: PermissionId[] }) {
    const { permissions } = arg;
    permissions.forEach(this._permissions.add.bind(this._permissions));
  }
}