import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";

export class LogPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Can the Requester FindMany Logs?
   */
  canFindMany(): boolean {
    return this.ctx.hasPermission(Permission.Logs.Viewer);
  }
}