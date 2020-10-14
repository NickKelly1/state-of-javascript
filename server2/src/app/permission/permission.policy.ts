import { PermissionModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "./permission.const";

export class PermissionPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async canFindMany(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowPermission]);
  }

  async canFindOne(arg: {
    ctx: IRequestContext;
    model: PermissionModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowPermission]);
  }

  async canCreate(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreatePermission]);
  }

  async canUpdate(arg: {
    ctx: IRequestContext;
    model: PermissionModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreatePermission]);
  }

  async canDelete(arg: {
    ctx: IRequestContext;
    model: PermissionModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreatePermission]);
  }
}