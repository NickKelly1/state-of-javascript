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


  /**
   * Can the Requester Find Many RolePermissions?
   */
  canFindMany(): boolean {

    // Can find Roles and Permissions
    return this.ctx.services.rolePolicy.canFindMany() && this.ctx.services.permissionPolicy.canFindMany();
  }


  /**
   * Can the Requester Find RolePermissions for the Role?
   */
  canFindForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;

    // The Role must be Findable
    return this.ctx.services.rolePolicy.canFindOne({ model: role });
  }


  /**
   * Can the Requester Find RolePermissions for the Permission?
   */
  canFindForPermission(arg: {
    permission: PermissionModel;
  }): boolean {
    const { permission } = arg;

    // The Role must be Findable
    return this.ctx.services.permissionPolicy.canFindOne({ model: permission });
  }


  /**
   * Can the Requester Find the RolePermission?
   */
  canFindOne(arg: {
    model: RolePermissionModel;
    role: RoleModel;
    permission: PermissionModel;
  }): boolean {
    const { model, role, permission } = arg;

    // The Role and Permission must both be Findable
    return this.canFindForRole({ role }) && this.canFindForPermission({ permission });
  }


  /**
   * Can the Requester Create a RolePermission for the Role?
   *
   * @param arg
   */
  canCreateForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;

    // the Role must be Findable
    if (!this.ctx.services.rolePolicy.canFindOne({ model: role })) return false;

    // is not the Admin Role
    if (role.isAdmin()) return false;

    // if the Role is Public, RoleAdmin is required
    if (role.isPublic()) return this.ctx.hasPermission(Permission.Roles.Admin);

    // if the Role is Authenticated, RoleAdmin is required
    if (role.isAuthenticated()) return this.ctx.hasPermission(Permission.Roles.Admin);

    // is Role Admin|Manager
    return this.ctx.hasPermission(
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
  }


  /**
   * Can the Requester create a RolePermission for the given Permission?
   *
   * @param arg
   */
  canCreateForPermission(arg: {
    permission: PermissionModel;
  }): boolean {
    const { permission } = arg;

    // the Pemrission must be Findable
    if (!this.ctx.services.permissionPolicy.canFindOne({ model: permission })) return false;

    // is not the SuperAdmin Permission
    if (permission.isSuperAdmin()) return false;

    // is Role Admin|Manager
    return this.ctx.hasPermission(
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
  }


  /**
   * Can the Requester create a RolePermission?
   *
   * @param arg
   */
  canCreate(arg: {
    role: RoleModel;
    permission: PermissionModel;
  }): boolean {
    const { role, permission } = arg;

    // Must be able to create given the Role and Permission
    return this.canCreateForRole({ role }) && this.canCreateForPermission({ permission })
  }


  /**
   * Can the Requester HardDelete the RolePermission given the Role? 
   *
   * @param arg
   */
  canHardDeleteForRole(arg: {
    role: RoleModel;
  }): boolean {
    const { role } = arg;

    // the Role must be Findable
    if (!this.ctx.services.rolePolicy.canFindOne({ model: role })) return false;

    // is not the Admin Role
    if (role.isAdmin()) return false;

    // if the Role is Public, RoleAdmin is required
    if (role.isPublic()) return this.ctx.hasPermission(Permission.Roles.Admin);

    // if the Role is Authenticated, RoleAdmin is required
    if (role.isAuthenticated()) return this.ctx.hasPermission(Permission.Roles.Admin);

    // is Role Admin|Manager
    return this.ctx.hasPermission(
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
  }


  /**
   * Can the Requester HardDelete the RolePermission given the Permission?
   *
   * @param arg
   */
  canHardDeleteForPermission(arg: {
    permission: PermissionModel;
  }): boolean {
    const { permission } = arg;

    // the Pemrission must be Findable
    if (!this.ctx.services.permissionPolicy.canFindOne({ model: permission })) return false;

    // is not the SuperAdmin Permission
    if (permission.isSuperAdmin()) return false;

    // is Role Admin|Manager
    return this.ctx.hasPermission(
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
  }


  /**
   * Can the Requester HardDelete the RolePermission
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: RolePermissionModel;
    role: RoleModel;
    permission: PermissionModel;
  }): boolean {
    const { model, role, permission } = arg;

    // Must be able to delete given the Role and Permission
    return this.canHardDeleteForRole({ role }) && this.canHardDeleteForPermission({ permission });
  }
}