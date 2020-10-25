import { ist } from "../helpers/ist.helper";
import { OrUndefined } from "../types/or-undefined.type";
import { PublicPermissions } from "./services/permission/permission.const";
import { PermissionId } from "./services/permission/permission.id";

export class ApiMe {
  protected readonly user?: { id: number; name: string; }
  protected readonly _permissions: PermissionId[];
  protected readonly _permission_set: Set<PermissionId>;
  public readonly access_exp: number;
  public readonly refresh_exp: number;

  constructor(arg: {
    user?: { id: number; name: string; }
    permissions: PermissionId[];
    access_exp: number;
    refresh_exp: number;
  }) {
    this.user = arg.user;
    this._permissions = arg.permissions.concat(PublicPermissions);
    this._permission_set = new Set(this._permissions);
    this.access_exp = arg.access_exp;
    this.refresh_exp = arg.refresh_exp;
  }

  is(user_id: number): boolean {
    if (ist.nullable(this.user?.id)) return false;
    return Number(this.user?.id) === Number(user_id);
  }

  get isAuthorised(): boolean {
    return ist.notNullable(this.user?.id);
  }

  get id(): OrUndefined<number> {
    return this.user?.id;
  }

  get name(): OrUndefined<string> {
    return this.user?.name;
  }

  hasSomePermissions(perms: PermissionId[]): boolean {
    return perms.some(this._permission_set.has.bind(this._permission_set))
  }

  hasEveryPermissions(perms: PermissionId[]): boolean {
    return perms.every(this._permission_set.has.bind(this._permission_set))
  }
}
