import { PermissionModel } from "../../circle";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "./permission.const";

export class PermissionPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Can the Requester FindMany Permissions?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {

    // is Admin or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Permissions.Show,
    ]);
  }

  /**
   * Can the Requester Find this Permission?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: PermissionModel;
  }): boolean {

    // is Admin or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.Permissions.Show,
    ]);
  }
}