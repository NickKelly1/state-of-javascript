import { RolePermissionModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
import { PermissionModel } from "../permission/permission.model";
import { RoleModel } from "../role/role.model";

export class RolePermissionPolicy {
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
      Permission.ManageRolePermissions,
      Permission.ShowRolePermissions,
    ]);
  }

  canFindOne(arg: {
    model: RolePermissionModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermissions,
      Permission.ShowRolePermissions,
    ]);
  }

  canCreateForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;

    // is not the Admin Role
    if (role.isAdmin()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermissions,
      Permission.CreateRolePermissions,
    ]);
  }

  canCreateForPermission(arg: {
    permission: PermissionModel;
  }): boolean {
    const { permission } = arg;

    // is not he SuperAdmin Permission
    if (permission.isSuperAdmin()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermissions,
      Permission.CreateRolePermissions,
    ]);
  }

  // TODO: optional role & perm
  canCreate(arg: {
    role: RoleModel;
    permission: PermissionModel;
  }): boolean {
    const { role, permission } = arg;
    const result = this.canCreateForRole({ role }) && this.canCreateForPermission({ permission })
    return result;
  }

  canHardDeleteForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;

    // is not the Admin Role
    if (role.isAdmin()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermissions,
      Permission.CreateRolePermissions,
    ]);
  }

  canHardDeleteForPermission(arg: {
    permission: PermissionModel;
  }): boolean {
    const { permission } = arg;

    // is not the SuperAdmin Permission
    if (permission.isSuperAdmin()) return false;
    j
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermissions,
      Permission.CreateRolePermissions,
    ]);
  }

  canHardDelete(arg: {
    model: RolePermissionModel;
    role: RoleModel;
    permission: PermissionModel;
  }): boolean {
    const { model, role, permission } = arg;
    return this.canHardDeleteForRole({ role }) && this.canHardDeleteForPermission({ permission });
  }
}