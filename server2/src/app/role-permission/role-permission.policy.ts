import { RolePermissionModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class RolePermissionPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async canFindMany(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowRolePermission]);
  }

  async canFindOne(arg: {
    ctx: IRequestContext;
    model: RolePermissionModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowRolePermission]);
  }

  async canCreate(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateRolePermission]);
  }

  async canDelete(arg: {
    ctx: IRequestContext;
    model: RolePermissionModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateRolePermission]);
  }
}