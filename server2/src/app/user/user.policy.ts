import { UserModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class UserPolicy {
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
      Permission.ManageUser,
      Permission.ShowUser,
    ]);
  }

  canFindOne(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUser,
      Permission.ShowUser,
    ]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUser,
      Permission.CreateUser,
    ]);
  }

  canUpdate(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    if (model.isProtected()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUser,
      Permission.CreateUser,
    ]);
  }

  canDelete(arg: {
    model: UserModel;
  }): boolean {
    const { model } = arg;
    if (model.isProtected()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUser,
      Permission.CreateUser,
    ]);
  }
}