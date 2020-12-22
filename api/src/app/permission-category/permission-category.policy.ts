import { Permission } from "../permission/permission.const";
import { PermissionCategoryModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";

export class PermissionCategoryPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Can the Requester Access PermissionCategories?
   *
   * @param arg
   */
  canAccess(): boolean {

    // is Admin or Shower
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.PermissionsCategories.Viewer,
    );
  }

  /**
   * Can the Requester FindMany PermissionCategories?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // is Admin or Shower
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.PermissionsCategories.Viewer,
    );
  }


  /**
   * Can the Requester Find this PermissionCategory?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: PermissionCategoryModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // is Admin or Viewer
    return this.ctx.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.PermissionsCategories.Viewer,
    );
  }
}