import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { NpmsDashboardModel } from "../npms-dashboard/npms-dashboard.model";
import { Permission } from "../permission/permission.const";
import { NpmsDashboardItemModel } from "./npms-dashboard-item.model";

export class NpmsDashboardItemPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Can the requester Show NpmsDashboardItems?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboardItem,
      Permission.ShowNpmsDashboardItem,
    ]);
  }


  /**
   * Can the requester Show NpmsDashboardItem's for the NpmsDashboard?
   *
   * @param arg
   */
  canFindOneForDashboard(arg: {
    dashboard: NpmsDashboardModel;
  }): boolean {
    const { dashboard } = arg;

    if (
      !dashboard.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.ShowNpmsDashboardItem])
    ) {
      return true;
    }

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboardItem,
    ]);
  }


  /**
   * Can the requester Show the NpmsDashboardItem?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NpmsDashboardItemModel;
    dashboard: NpmsDashboardModel;
  }): boolean {
    const { model, dashboard } = arg;

    return this.canFindOneForDashboard({ dashboard });
  }


  /**
   * Can the requester Create NpmsDashboardItem's for the given NpmsDashboard?
   *
   * @param arg
   */
  canCreateForDashboard(arg: {
    dashboard: NpmsDashboardModel;
  }) {
    const { dashboard } = arg;
    if (dashboard.isSoftDeleted()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboardItem,
      Permission.CreateNpmsDashboardItem,
    ]);
  }


  /**
   * Can the requester Create NpmsDashboardItems?
   *
   * @param arg
   */
  canCreate(arg: {
    dashboard: NpmsDashboardModel;
  }): boolean {
    const { dashboard } = arg;
    return this.canCreateForDashboard({ dashboard });
  }


  /**
   * Can the requester Update NpmsDashboardItem's for the NpmsDashboard?
   *
   * @param arg
   */
  canUpdateForDashboard(arg: {
    dashboard: NpmsDashboardModel;
  }) {
    const { dashboard } = arg;

    if (
      !dashboard.isSoftDeleted()
      && this.ctx.auth.isMeByUserId(dashboard.owner_id)
      && this.ctx.auth.hasAnyPermissions([Permission.UpdateOwnNpmsDashboardItem])
    ) {
      return true;
    }

    if (
      !dashboard.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.UpdateNpmsDashboards])
    ) {
      return true;
    }

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboardItem,
    ]);
  }


  /**
   * Can the requester Update the NpmsDashboardItem?
   *
   * @param arg
   */
  canUpdate(arg: {
    model: NpmsDashboardItemModel;
    dashboard: NpmsDashboardModel;
  }): boolean {
    const { model, dashboard } = arg;
    return this.canUpdateForDashboard({ dashboard, });
  }


  /**
   * Can the request HardDelete NpmsDashboardItem's for the given NpmsDashboard?
   *
   * @param arg
   */
  canHardDeleteForDashboard(arg: {
    dashboard: NpmsDashboardModel;
  }) {
    const { dashboard } = arg;

    if (
      !dashboard.isSoftDeleted()
      && this.ctx.auth.isMeByUserId(dashboard.owner_id)
      && this.ctx.auth.hasAnyPermissions([Permission.HardDeleteOwnNpmsDashboardItem])
    ) {
      return true;
    }

    if (
      !dashboard.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.HardDeleteNpmsDashboardItem])
    ) {
      return true;
    }

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboardItem,
    ]);
  }


  /**
   * Can the requester HardDelete the NpmsDashboardItem?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: NpmsDashboardItemModel;
    dashboard: NpmsDashboardModel;
  }): boolean {
    const { model, dashboard } = arg;

    return this.canHardDeleteForDashboard({ dashboard });
  }
}
