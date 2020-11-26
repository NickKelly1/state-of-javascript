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


  /**
   * Can the Requester FindMany UserRoles?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.UserRoles.Manage,
      Permission.UserRoles.Show,
    ]);
  }


  /**
   * Can the Requester Find this UserRole?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: UserRoleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.UserRoles.Manage,
      Permission.UserRoles.Show,
    ]);
  }


  /**
   * Can the Requester Create UserRoles for the User?
   *
   * @param arg
   */
  canCreateForUser(arg: {
    user: UserModel;
  }): boolean {
    const { user } = arg;

    // is not the Admin user
    if (user.isAdmin()) return false;

    // is not the System User
    if (user.isSystem()) return false;

    // is not the Anonymous User
    if (user.isAnonymous()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.UserRoles.Manage,
      Permission.UserRoles.Create,
    ]);
  }


  /**
   * Can the Requester Create UserRoles for the Role?
   *
   * @param arg
   */
  canCreateForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;

    // is not the Admin Role
    if (role.isAdmin()) return false;

    // is not the Authenticated Role
    if (role.isAuthenticated()) return false;
    
    // is not the Public Role
    if (role.isPublic()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.UserRoles.Manage,
      Permission.UserRoles.Create,
    ]);
  }


  /**
   * Can the Requester Create UserRoles?
   *
   * @param arg
   */
  canCreate(arg: {
    user: UserModel;
    role: RoleModel;
  }): boolean {
    const { user, role } = arg;
    return this.canCreateForUser({ user }) && this.canCreateForRole({ role });
  }


  /**
   * Can the Requester HardDelete UserRoles for the User?
   *
   * @param arg
   */
  canHardDeleteForUser(arg: {
    user: UserModel;
  }): boolean {
    const { user } = arg;

    // is not the Admin user
    if (user.isAdmin()) return false;

    // is not the System User
    if (user.isSystem()) return false;

    // is not the Anonymous User
    if (user.isAnonymous()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.UserRoles.Manage,
      Permission.UserRoles.HardDelete,
    ]);
  }


  /**
   * Can the Requester HardDelete UserRoles for the Role?
   *
   * @param arg
   */
  canHardDeleteForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;

    // is not the Admin Role
    if (role.isAdmin()) return false;

    // is not the Authenticated Role
    if (role.isAuthenticated()) return false;
    
    // is not the Public Role
    if (role.isPublic()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.UserRoles.Manage,
      Permission.UserRoles.HardDelete,
    ]);
  }


  /**
   * Can teh Requester HardDelete this UserRole?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: UserRoleModel;
    user: UserModel;
    role: RoleModel;
  }): boolean {
    const { model, user, role } = arg;
    return this.canHardDeleteForUser({ user }) && this.canHardDeleteForRole({ role });
  }
}