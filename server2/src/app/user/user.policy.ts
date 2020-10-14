import { UserModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class UserPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async canFindMany(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowUser]);
  }

  async canFindOne(arg: {
    ctx: IRequestContext;
    model: UserModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowUser]);
  }

  async canCreate(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateUser]);
  }

  async canUpdate(arg: {
    ctx: IRequestContext;
    model: UserModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateUser]);
  }

  async canDelete(arg: {
    ctx: IRequestContext;
    model: UserModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateUser]);
  }
}