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

    // is Admin or Manager or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
      Permission.NpmsDashboardItems.Show,
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
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboardItems.Show])
    ) {
      return true;
    }

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
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

    // can FindOne for the Dashboard
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

    // is Admon or Manager or Creator
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
      Permission.NpmsDashboardItems.Create,
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

    // can Create for the Dashboard
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
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboardItems.UpdateOwn])
    ) {
      return true;
    }

    if (
      !dashboard.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.Update])
    ) {
      return true;
    }

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
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
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboardItems.HardDeleteOwn])
    ) {
      return true;
    }

    if (
      !dashboard.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboardItems.HardDelete])
    ) {
      return true;
    }

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
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
