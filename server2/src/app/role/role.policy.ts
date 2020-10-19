import { RoleModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class RolePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([Permission.ShowRole]);
  }

  canFindOne(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([Permission.ShowRole]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([Permission.CreateRole]);
  }

  canUpdate(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([Permission.CreateRole]);
  }

  canDelete(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([Permission.CreateRole]);
  }
}