import { UserRoleModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class UserRolePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async canFindMany(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowUserRole]);
  }

  async canFindOne(arg: {
    ctx: IRequestContext;
    model: UserRoleModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowUserRole]);
  }

  async canCreate(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateUserRole]);
  }

  async canDelete(arg: {
    ctx: IRequestContext;
    model: UserRoleModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateUserRole]);
  }
}