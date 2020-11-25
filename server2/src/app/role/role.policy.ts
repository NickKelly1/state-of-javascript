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
      Permission.ManageRoles,
      Permission.ShowRoles,
    ]);
  }


  canFindOne(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRoles,
      Permission.ShowRoles,
    ]);
  }


  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRoles,
      Permission.CreateRoles,
    ]);
  }


  canUpdate(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;

    // is not Admin Role
    if (model.isAdmin()) return false;

    // is not Authenticated Role
    if (model.isAuthenticated()) return false;

    // is not Public Role
    if (model.isPublic()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRoles,
      Permission.UpdateRoles,
    ]);
  }


  canSoftDelete(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;

    // is not Admin role
    if (model.isAdmin()) return false;

    // is not Authenticated Role
    if (model.isAuthenticated()) return false;

    // is not Public Role
    if (model.isPublic()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRoles,
      Permission.SoftDeleteRoles,
    ]);
  }


  canHardDelete(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;

    // is not Admin Role
    if (model.isAdmin()) return false;

    // is not Authenticated Role
    if (model.isAuthenticated()) return false;

    // is not Public Role
    if (model.isPublic()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRoles,
      Permission.SoftDeleteRoles,
    ]);
  }


  canRestore(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;

    // is not Admin Role
    if (model.isAdmin()) return false;

    // is not Authenticated Role
    if (model.isAuthenticated()) return false;

    // is not Public Role
    if (model.isPublic()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRoles,
      Permission.CreateRoles,
    ]);
  }
}