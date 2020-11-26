import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
import { PermissionCategoryModel } from "../../circle";

export class PermissionCategoryPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  /**
   * Can the Requester FindMany PermissionCategories?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {

    // is Admin or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.PermissionsCategories.Show,
    ]);
  }


  /**
   * Can the Requester Find this PermissionCategory?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: PermissionCategoryModel;
  }): boolean {

    // is Admin or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.PermissionsCategories.Show,
    ]);
  }
}