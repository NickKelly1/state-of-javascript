import { PermissionModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "./permission.const";

export class PermissionPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ShowPermissions,
    ]);
  }

  canFindOne(arg: {
    model: PermissionModel;
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ShowPermissions,
    ]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return false;
  }
}