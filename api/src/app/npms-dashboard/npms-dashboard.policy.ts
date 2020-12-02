import { ist } from "../../common/helpers/ist.helper";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
import { NpmsDashboardModel } from "./npms-dashboard.model";

export class NpmsDashboardPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Can the Requester Show NpmsDashboards?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {

    // is NpmsDashboard Admin|Manager|Creator|Viewer
    return this.ctx.hasPermission(
      Permission.NpmsDashboards.Admin,
      Permission.NpmsDashboards.Manager,
      Permission.NpmsDashboards.Creator,
      Permission.NpmsDashboards.Viewer,
    );
  }


  /**
   * Can the Requester Show this NpmsDashboard?
   *
   * @param arg
   *
   * Logic equivalent to NpmsDashboardRepository
   */
  canFindOne(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;

    // is NpmsDashboardAdmin
    if (this.ctx.hasPermission(Permission.NpmsDashboards.Admin)) return true;

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is NpmsDashboardManager
    if (this.ctx.hasPermission(Permission.NpmsDashboards.Manager)) return true;

    // is Owner & Viewer|Creator
    if (
      model.isOwnedByCtx(this.ctx)
      && this.ctx.hasPermission(
        Permission.NpmsDashboards.Viewer,
        Permission.NpmsDashboards.Creator,
      )
    ) {
      return true;
    }

    // is Published & Requester is a Viewer
    if (model.isPublished() && this.ctx.hasPermission(Permission.NewsArticles.Viewer)) {
      return true;
    }

    // failed
    return false;
  }


  /**
   * Can the Requester Sort NpmsDashboards?
   *
   * @param arg
   */
  canSort(): boolean {

    // is NpmsDashboard Admin|Manager
    return this.ctx.hasPermission(
      Permission.NpmsDashboards.Admin,
      Permission.NpmsDashboards.Manager,
    );
  }


  /**
   * Can the requester Create NpmsDashboards?
   *
   * @param arg
   */
  canCreate(): boolean {

    // is NpmsDashboard Admin|Manager|Creator
    return this.ctx.hasPermission(
      Permission.NpmsDashboards.Admin,
      Permission.NpmsDashboards.Manager,
      Permission.NpmsDashboards.Creator,
    );
  }


  /**
   * Can the request Update this NpmsDashboard?
   *
   * @param arg
   */
  canUpdate(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // can if Admin
    if (this.ctx.hasPermission(Permission.NpmsDashboards.Admin)) return true;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // can if Manager
    if (this.ctx.hasPermission(Permission.NpmsDashboards.Manager)) return true;

    // is Owner & Creator
    if (model.isOwnedByCtx(this.ctx) && this.ctx.hasPermission(Permission.NpmsDashboards.Creator)) {
      return true;
    }

    // failed
    return false;
  }


  /**
   * Can the Requester SoftDelete this NpmsDashboard?
   *
   * @param arg
   */
  canSoftDelete(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // can if NpmsDashboard Admin|Manager
    if (this.ctx.hasPermission(
      Permission.NpmsDashboards.Admin,
      Permission.NpmsDashboards.Manager,
    )) {
      return true;
    }

    // can if Owner & NpmsDashboardCreator
    if (model.isOwnedByCtx(this.ctx) && this.ctx.hasPermission(Permission.NpmsDashboards.Creator)) {
      return true;
    }

    return false;
  }


  /**
   * Can the Requester HardDelete this NpmsDashboard?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // is Admin
    if (this.ctx.hasPermission(Permission.NpmsDashboards.Admin)) return true;

    // failed
    return false;
  }


  /**
   * Can the Requester Restore this NpmsDashboard?
   *
   * @param arg
   */
  canRestore(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // is Admin
    if (this.ctx.hasPermission(Permission.NpmsDashboards.Admin)) return true;

    // failed
    return false;
  }


  /**
   * Can the Requester Submit this NpmsDashboard?
   *
   * @param arg
   */
  canSubmit(arg: {
    model: NpmsDashboardModel,
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // must be Submittable
    if (!(model.isSubmittable())) return false;

    // must be Updateable
    return this.canUpdate({ model });
  }


  /**
   * Can the requester Reject this NpmsDashboard?
   *
   * @param arg
   */
  canReject(arg: {
    model: NpmsDashboardModel,
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // must be Rejectable
    if (!(model.isRejectable())) return false;

    // can if NpmsDashboard Admin|Manager
    if (this.ctx.hasPermission(Permission.NpmsDashboards.Admin, Permission.NpmsDashboards.Manager)) {
      return true;
    };

    // can if Owner & NpmsDashboardCreator
    if (model.isOwnedBy(this.ctx.auth) && this.ctx.hasPermission(Permission.NpmsDashboards.Creator)) {
      return true;
    }

    // failed
    return false;
  }


  /**
   * Can the Requester Publish this NpmsDashboard
   * 
   * @param arg
   */
  canPublish(arg: {
    model: NpmsDashboardModel,
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // must be Publishable
    if (!(model.isPublishable())) return false;

    // can if NpmsDashboard Admin|Manager
    return this.ctx.hasPermission(
      Permission.NpmsDashboards.Admin,
      Permission.NpmsDashboards.Manager,
    );
  }


  /**
   * Can the requester Unpublish this NpmsDashboard?
   *
   * @param arg
   */
  canUnpublish(arg: {
    model: NpmsDashboardModel,
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // must be Unpublishable
    if (!model.isUnpublishable()) return false;

    // can if NpmsDashboard Admin|Manager
    return this.ctx.hasPermission(
      Permission.NpmsDashboards.Admin,
      Permission.NpmsDashboards.Manager,
    );
  }
}