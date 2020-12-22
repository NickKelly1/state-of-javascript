import { PermissionModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { Permission } from "./permission.const";

export class PermissionPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Requester Access Permissions?
   *
   * @param arg
   */
  canAccess(): boolean {

    // is Admin or Viewer
    return this.ctx.hasPermission(Permission.Permissions.Viewer);
  }

  /**
   * Can the Requester FindMany Permissions?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // is Admin or Viewer
    return this.ctx.hasPermission(Permission.Permissions.Viewer);
  }

  /**
   * Can the Requester Find this Permission?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: PermissionModel;
  }): boolean {
    const { model, } = arg;

    // can access
    if (!this.canAccess()) return false;

    // is Admin or Viewer
    return this.ctx.hasPermission(Permission.Permissions.Viewer);
  }
}