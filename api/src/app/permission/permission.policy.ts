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

    // is Admin or Viewer
    return this.ctx.hasPermission(Permission.Permissions.Viewer);
  }
}