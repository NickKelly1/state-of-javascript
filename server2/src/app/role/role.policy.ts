import { RoleModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";

export class RolePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Can the Requester FindMany Roles?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {

    // is Admin, Manager or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Manage,
      Permission.Roles.Show,
    ]);
  }


  /**
   * Can the Requester Find the Role?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: RoleModel;
  }): boolean {
    const { model } = arg;

    // is Admin, Manager or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Manage,
      Permission.Roles.Show,
    ]);
  }


  /**
   * Can the Requester Create the Role?
   *
   * @param arg
   */
  canCreate(arg?: {
    //
  }): boolean {

    // is Admin, Manager or Creator
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Manage,
      Permission.Roles.Create,
    ]);
  }


  /**
   * Can the Requester Update the Role?
   *
   * @param arg
   */
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

    // is Admin, Manager or Updater
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Manage,
      Permission.Roles.Update,
    ]);
  }


  /**
   * Can the Requester SoftDelete the Role?
   *
   * @param arg
   */
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

    // is Admin, Manager or SoftDeleter
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Manage,
      Permission.Roles.SoftDelete,
    ]);
  }


  /**
   * Can the Requester HardDelete the Role?
   *
   * @param arg
   */
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

    // is Admin, Manager or HardDeleter
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Manage,
      Permission.Roles.HardDelete,
    ]);
  }


  /**
   * Can the Requester Restore the Role?
   *
   * @param arg
   */
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

    // is Admin, Manager or Restorer
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Manage,
      Permission.Roles.Restore,
    ]);
  }
}