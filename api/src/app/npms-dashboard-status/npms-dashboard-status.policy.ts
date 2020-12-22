import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";
import { NpmsDashboardStatusModel } from "./npms-dashboard-status.model";

export class NpmsDashboardStatusPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * can the Requester Show many NpmsDashboardStatuses?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // is NpmsDashboardStatusViewer
    return this.ctx.hasPermission(Permission.NpmsDashboardStatuses.Viewer);
  }


  /**
   * Can the Requester Show this NpmsDashboardStatus?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NpmsDashboardStatusModel;
  }): boolean {
    const { model } = arg;

    // is NpmsDashboardStatusViewer
    return this.ctx.hasPermission(Permission.NpmsDashboardStatuses.Viewer);
  }
}