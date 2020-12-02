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
  canFindMany(): boolean {

    // is SuperAdmin, RoleAdmin, or RoleViewer
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Admin,
      Permission.Roles.Viewer,
    );
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

    // is SuperAdmin, RoleAdmin, or RoleViewer
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Admin,
      Permission.Roles.Viewer,
    );
  }


  /**
   * Can the Requester Create the Role?
   *
   * @param arg
   */
  canCreate(): boolean {

    // is SuperAdmin, RoleAdmin, or RoleManager
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
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

    // is SuperAdmin, RoleAdmin, or Rolemanager
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
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

    // is SuperAdmin, RoleAdmin or RoleManager
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
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

    // is SuperAdmin, RoleAdmin or RoleManager
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
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

    // is SuperAdmin, RoleAdmin or RoleManager
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.Roles.Admin,
      Permission.Roles.Manager,
    );
  }
}