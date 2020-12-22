import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";

export class JobPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Can the Requester Access Jobs?
   */
  canAccess(): boolean {

    // has JobViewer
    return this.ctx.hasPermission(Permission.Jobs.Viewer);
  }

  /**
   * Can the Requester FindMany Jobs?
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // has JobViewer
    return this.ctx.hasPermission(Permission.Jobs.Viewer);
  }
}