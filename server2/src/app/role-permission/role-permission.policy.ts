import { RolePermissionModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class RolePermissionPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([Permission.ShowRolePermission]);
  }

  canFindOne(arg: {
    model: RolePermissionModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([Permission.ShowRolePermission]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([Permission.CreateRolePermission]);
  }

  canDelete(arg: {
    model: RolePermissionModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([Permission.CreateRolePermission]);
  }
}