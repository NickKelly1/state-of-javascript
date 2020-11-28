import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { NpmsDashboardModel } from "../npms-dashboard/npms-dashboard.model";
import { NpmsPackageModel } from "../npms-package/npms-package.model";
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
      Permission.NpmsDashboardItems.ShowAll,
      Permission.NpmsDashboardItems.ShowOnVisibleDashboards,
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

    // is Admin, Manager or ShowAller
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
      Permission.NpmsDashboardItems.ShowAll,
    ])) {
      return true;
    };

    // Dashboard must be Findable & Requester can ShowOnVisibleDashboards
    if (this.ctx.services.npmsDashboardPolicy.canFindOne({ model: dashboard })
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboardItems.ShowOnVisibleDashboards])
    ) {
      return true;
    }

    // failed
    return false;
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

    // Dashboard must be Findable
    if (!this.ctx.services.npmsDashboardPolicy.canFindOne({ model: dashboard })) return false;

    // can if Admin or Manager
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
      Permission.NpmsDashboardItems.CreateOnVisibleDashboards,
    ])) {
      return true;
    }

    // Dashboard must not be SoftDeleted
    if (dashboard.isSoftDeleted()) return false;

    // can if Owner & can Create on own Dashboards
    return this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboardItems.CreateOnOwnDashboards])
      && dashboard.isOwnedBy(this.ctx.auth);
  }


  /**
   * Can the requester Create NpmsDashboardItems?
   *
   * @param arg
   */
  canCreate(arg: {
    dashboard: NpmsDashboardModel;
    npmsPackage: NpmsPackageModel;
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

    // Dashboard must be Findable
    if (!this.ctx.services.npmsDashboardPolicy.canFindOne({ model: dashboard })) return false;

    // is Admin or Manager
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
      Permission.NpmsDashboardItems.UpdateOnVisibleDashboards,
    ])) {
      return true;
    };

    // Dashboard must not be SoftDeleted
    if (dashboard.isSoftDeleted()) return false;

    // can if Owner & can Update on own Dashboards
    return this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboardItems.UpdateOnOwnDashboards])
      && dashboard.isOwnedBy(this.ctx.auth);
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

    // Dashboard must be Findable
    if (!this.ctx.services.npmsDashboardPolicy.canFindOne({ model: dashboard })) return false;

    // is Admin or Manager
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboardItems.Manage,
      Permission.NpmsDashboardItems.HardDeleteOnVisibleDashboards,
    ])) {
      return true;
    };

    // can if Owner & can HardDelete on own Dashboards
    return this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboardItems.HardDeleteOnOwnDashboards])
      && dashboard.isOwnedBy(this.ctx.auth);
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
