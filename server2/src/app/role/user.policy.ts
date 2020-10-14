import { RoleModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class RolePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async canFindMany(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowRole]);
  }

  async canFindOne(arg: {
    ctx: IRequestContext;
    model: RoleModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowRole]);
  }

  async canCreate(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateRole]);
  }

  async canUpdate(arg: {
    ctx: IRequestContext;
    model: RoleModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateRole]);
  }

  async canDelete(arg: {
    ctx: IRequestContext;
    model: RoleModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateRole]);
  }
}