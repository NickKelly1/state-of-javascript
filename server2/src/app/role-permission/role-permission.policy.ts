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
      Permission.ManageRolePermission,
      Permission.ShowRolePermission,
    ]);
  }

  canFindOne(arg: {
    model: RolePermissionModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermission,
      Permission.ShowRolePermission,
    ]);
  }

  canCreateForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;
    if (role.isAdmin()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermission,
      Permission.CreateRolePermission,
    ]);
  }

  canCreateForPermission(arg: {
    permission: PermissionModel;
  }): boolean {
    const { permission } = arg;
    if (permission.isSuperAdmin()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermission,
      Permission.CreateRolePermission,
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

  canDeleteForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;
    if (role.isAdmin()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermission,
      Permission.CreateRolePermission,
    ]);
  }

  canDeleteForPermission(arg: {
    permission: PermissionModel;
  }): boolean {
    const { permission } = arg;
    if (permission.isSuperAdmin()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageRolePermission,
      Permission.CreateRolePermission,
    ]);
  }

  canDelete(arg: {
    model: RolePermissionModel;
    role: RoleModel;
    permission: PermissionModel;
  }): boolean {
    const { model, role, permission } = arg;
    return this.canDeleteForRole({ role }) && this.canDeleteForPermission({ permission });
  }
}