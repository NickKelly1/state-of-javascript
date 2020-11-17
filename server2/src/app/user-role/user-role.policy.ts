import { UserRoleModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
import { RoleModel } from "../role/role.model";
import { UserModel } from "../user/user.model";

export class UserRolePolicy {
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
      Permission.ManageUserRoles,
      Permission.ShowUserRoles,
    ]);
  }

  canFindOne(arg: {
    model: UserRoleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUserRoles,
      Permission.ShowUserRoles,
    ]);
  }

  canCreateForUser(arg: {
    user: UserModel;
  }): boolean {
    const { user } = arg;
    if (user.isAdmin()) return false;
    if (user.isSystem()) return false;
    if (user.isAnonymous()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUserRoles,
      Permission.CreateUserRoles,
    ]);
  }

  canCreateForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;
    if (role.isAdmin()) return false;
    if (role.isPublic()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUserRoles,
      Permission.CreateUserRoles,
    ]);
  }

  canCreate(arg: {
    user: UserModel;
    role: RoleModel;
  }): boolean {
    const { user, role } = arg;
    return this.canCreateForUser({ user }) && this.canCreateForRole({ role });
  }


  canHardDeleteForUser(arg: {
    user: UserModel;
  }): boolean {
    const { user } = arg;
    if (user.isAdmin()) return false;
    if (user.isSystem()) return false;
    if (user.isAnonymous()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUserRoles,
      Permission.HardDeleteUserRoles,
    ]);
  }


  canHardDeleteForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;
    if (role.isAdmin()) return false;
    if (role.isPublic()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageUserRoles,
      Permission.HardDeleteUserRoles,
    ]);
  }


  canHardDelete(arg: {
    model: UserRoleModel;
    user: UserModel;
    role: RoleModel;
  }): boolean {
    const { model, user, role } = arg;
    return this.canHardDeleteForUser({ user }) && this.canHardDeleteForRole({ role });
  }
}