import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { Permission } from "../permission/permission.const";
import { UserModel } from "../user/user.model";
import { NpmsDashboardStatusModel } from "./npms-dashboard-status.model";

export class NpmsDashboardStatusPolicy {

  constructor(
    protected readonly ctx: IRequestContext,
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