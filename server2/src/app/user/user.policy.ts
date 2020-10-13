import { Unauthorized } from "http-errors";
import { QueryRunner } from "../../common/classes/query-runner";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/constants/permission.const";
import { UserModel } from "./user.model";

export const UserPolicy = {
  async canFindMany(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowUser]);
  },

  async canFindOne(arg: {
    ctx: IRequestContext;
    model: UserModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.ShowUser]);
  },

  async canCreate(arg: {
    ctx: IRequestContext;
  }): Promise<boolean> {
    const { ctx } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateUser]);
  },

  async canUpdate(arg: {
    ctx: IRequestContext;
    model: UserModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateUser]);
  },

  async canDelete(arg: {
    ctx: IRequestContext;
    model: UserModel;
  }): Promise<boolean> {
    const { ctx, model } = arg;
    return ctx.auth.hasAnyPermissions([Permission.CreateUser]);
  }
}