import { UserRoleModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";
import { RoleModel } from "../role/role.model";
import { UserModel } from "../user/user.model";

export class UserRolePolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Can the Requester Access UserRoles?
   *
   * @param arg
   */
  canAccess(): boolean {

    // user and roles must be accessible
    return this.ctx.services.userPolicy.canAccess() && this.ctx.services.rolePolicy.canAccess();
  }

  /**
   * Can the Requester FindMany UserRoles?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // Can find Roles and Users
    return this.ctx.services.userPolicy.canFindMany() && this.ctx.services.rolePolicy.canFindMany();
  }


  /**
   * Can the Requester find UserRoles for a Role?
   */
  canFindForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;

    // can access
    if (!this.canAccess()) return false;

    // Role must be Findable
    return this.ctx.services.rolePolicy.canFindOne({ model: role });
  }


  /**
   * Can the Requester find UserRoles for a User?
   */
  canFindForUser(arg: {
    user: UserModel;
  }): boolean {
    const { user } = arg;

    // can access
    if (!this.canAccess()) return false;

    // User must be Findable
    return this.ctx.services.userPolicy.canFindOne({ model: user });
  }


  /**
   * Can the Requester Find this UserRole?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: UserRoleModel;
    user: UserModel;
    role: RoleModel;
  }): boolean {
    const { model, user, role } = arg;

    // can access
    if (!this.canAccess()) return false;

    // Role & User must be each visible
    return this.canFindForRole({ role }) && this.canFindForUser({ user });
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

    // can access
    if (!this.canAccess()) return false;

    // User must be Findable
    if (!this.ctx.services.userPolicy.canFindOne({ model: user })) return false;

    // is not the Admin user
    if (user.isAdmin()) return false;

    // is not the System User
    if (user.isSystem()) return false;

    // is not the Anonymous User
    if (user.isAnonymous()) return false;

    // is UserAdmin or UserManager
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // Role must be Findable
    if (!this.ctx.services.rolePolicy.canFindOne({ model: role })) return false;

    // is not the Admin Role
    if (role.isAdmin()) return false;

    // is not the Authenticated Role
    if (role.isAuthenticated()) return false;

    // is not the Public Role
    if (role.isPublic()) return false;

    // is UserAdmin or UserManager
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // Must be Creatable for User and Role
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

    // can access
    if (!this.canAccess()) return false;

    // User be Findable
    if (!this.ctx.services.userPolicy.canFindOne({ model: user })) return false;

    // is not the Admin user
    if (user.isAdmin()) return false;

    // is not the System User
    if (user.isSystem()) return false;

    // is not the Anonymous User
    if (user.isAnonymous()) return false;

    // is UserAdmin or UserManager
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
    );
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

    // can access
    if (!this.canAccess()) return false;

    // Role be Findable
    if (!this.ctx.services.rolePolicy.canFindOne({ model: role })) return false;

    // is not the Admin Role
    if (role.isAdmin()) return false;

    // is not the Authenticated Role
    if (role.isAuthenticated()) return false;
    
    // is not the Public Role
    if (role.isPublic()) return false;

    // is UserAdmin or UserManager
    return this.ctx.hasPermission(
      Permission.Users.Admin,
      Permission.Users.Manager,
    );
  }


  /**
   * Can the Requester HardDelete this UserRole?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: UserRoleModel;
    user: UserModel;
    role: RoleModel;
  }): boolean {
    const { model, user, role } = arg;

    // can access
    if (!this.canAccess()) return false;

    // must be HardDeleteable for User and Role
    return this.canHardDeleteForUser({ user }) && this.canHardDeleteForRole({ role });
  }
}