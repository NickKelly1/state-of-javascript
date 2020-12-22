import { BaseContext } from "../../common/context/base.context";
import { NpmsDashboardModel } from "../npms-dashboard/npms-dashboard.model";
import { NpmsPackageModel } from "../npms-package/npms-package.model";
import { NpmsDashboardItemModel } from "./npms-dashboard-item.model";

export class NpmsDashboardItemPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the requester Access NpmsDashboardItems?
   *
   * @param arg
   */
  canAccess(): boolean {

    // Can find NpmsDashboard & NpmsPackages
    return this.ctx.services.npmsDashboardPolicy.canFindMany()
      && this.ctx.services.npmsPackagePolicy.canFindMany();
  }


  /**
   * Can the requester Show NpmsDashboardItems?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    // Can find NpmsDashboard & NpmsPackages
    return this.ctx.services.npmsDashboardPolicy.canFindMany()
      && this.ctx.services.npmsPackagePolicy.canFindMany();
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

    // can access
    if (!this.canAccess()) return false;

    // Dashboard must be Findable
    return this.ctx.services.npmsDashboardPolicy.canFindOne({ model: dashboard });
  }


  /**
   * Can the requester Show NpmsDashboardItem's for the NpmsPackage?
   *
   * @param arg
   */
  canFindOneForPackage(arg: {
    npmsPackage: NpmsPackageModel;
  }): boolean {
    const { npmsPackage } = arg;

    // can access
    if (!this.canAccess()) return false;

    // Dashboard must be Findable
    return this.ctx.services.npmsPackagePolicy.canFindOne({ model: npmsPackage });
  }



  /**
   * Can the requester Show the NpmsDashboardItem?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NpmsDashboardItemModel;
    dashboard: NpmsDashboardModel;
    npmsPackage: NpmsPackageModel;
  }): boolean {
    const { model, dashboard, npmsPackage } = arg;

    // can access
    if (!this.canAccess()) return false;

    // NpmsDashboard and NpmsPackage must be Findable
    return this.canFindOneForDashboard({ dashboard })
      && this.canFindOneForPackage({ npmsPackage });
  }


  /**
   * Can the requester Create NpmsDashboardItem's for the given NpmsDashboard?
   *
   * @param arg
   */
  canCreateForDashboard(arg: {
    dashboard: NpmsDashboardModel;
  }): boolean {
    const { dashboard } = arg;

    // can access
    if (!this.canAccess()) return false;

    // Dashboard must be Findable and Updateable
    return this.ctx.services.npmsDashboardPolicy.canFindOne({ model: dashboard })
      && this.ctx.services.npmsDashboardPolicy.canUpdate({ model: dashboard });
  }


  /**
   * Can the requester Create NpmsDashboardItem's for the given NpmsDashboard?
   *
   * @param arg
   */
  canCreateForNpmsPackage(arg: {
    npmsPackage: NpmsPackageModel;
  }): boolean {
    const { npmsPackage } = arg;

    // can access
    if (!this.canAccess()) return false;

    // NpmsPackage must be Findable
    return this.ctx.services.npmsPackagePolicy.canFindOne({ model: npmsPackage });
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
    const { dashboard, npmsPackage, } = arg;

    // can access
    if (!this.canAccess()) return false;

    // can Create for the Dashboard
    return this.canCreateForDashboard({ dashboard })
      && this.canCreateForNpmsPackage({ npmsPackage });
  }


  /**
   * Can the request HardDelete NpmsDashboardItem's for the given NpmsDashboard?
   *
   * @param arg
   */
  canHardDeleteForDashboard(arg: {
    dashboard: NpmsDashboardModel;
  }): boolean {
    const { dashboard } = arg;

    // can access
    if (!this.canAccess()) return false;

    // Dashboard must be Findable and Updateable
    return this.ctx.services.npmsDashboardPolicy.canFindOne({ model: dashboard })
      && this.ctx.services.npmsDashboardPolicy.canUpdate({ model: dashboard });
  }


  /**
   * Can the request HardDelete NpmsDashboardItem's for the given NpmsDashboard?
   *
   * @param arg
   */
  canHardDeleteForNpmsPackage(arg: {
    npmsPackage: NpmsPackageModel;
  }): boolean {
    const { npmsPackage } = arg;

    // can access
    if (!this.canAccess()) return false;

    // NpmsPackage must be Findable
    return this.ctx.services.npmsPackagePolicy.canFindOne({ model: npmsPackage });
  }


  /**
   * Can the requester HardDelete the NpmsDashboardItem?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: NpmsDashboardItemModel;
    dashboard: NpmsDashboardModel;
    npmsPackage: NpmsPackageModel;
  }): boolean {
    const { model, dashboard, npmsPackage } = arg;

    // can access
    if (!this.canAccess()) return false;

    return this.canHardDeleteForDashboard({ dashboard })
      && this.canHardDeleteForNpmsPackage({ npmsPackage });
  }
}
