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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRole,
      Permission.ShowRole,
    ]);
  }

  canFindOne(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRole,
      Permission.ShowRole,
    ]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRole,
      Permission.CreateRole,
    ]);
  }

  canUpdate(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;
    if (model.isAdmin()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRole,
      Permission.CreateRole,
    ]);
  }

  canDelete(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;
    if (model.isAdmin()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRole,
      Permission.CreateRole,
    ]);
  }
}