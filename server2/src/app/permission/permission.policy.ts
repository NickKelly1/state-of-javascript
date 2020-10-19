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
    return this.ctx.auth.hasAnyPermissions([Permission.ShowPermission]);
  }

  canFindOne(arg: {
    model: PermissionModel;
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([Permission.ShowPermission]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return false;
  }

  canUpdate(arg: {
    model: PermissionModel;
  }): boolean {
    const { model } = arg;
    return false;
  }

  canDelete(arg: {
    model: PermissionModel;
  }): boolean {
    const { model } = arg;
    return false;
  }
}