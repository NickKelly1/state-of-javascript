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

    // is Admin or Manager or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.ShowAll,
      Permission.NpmsDashboards.ShowSome,
    ]);
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

    // can if Admin, Manager or ShowAller
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.ShowAll,
    ])) {
      return true;
    }

    // must have ShowSome
    if (!this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.ShowSome])) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // can if Published
    if (model.isPublished()) return true;

    // can if is Owner
    if (model.isOwnedBy(this.ctx.auth)) return true;

    // failed
    return false;
  }


  /**
   * Can the Requester Sort NpmsDashboards?
   *
   * @param arg
   */
  canSort(): boolean {

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ]);
  }


  /**
   * Can the requester Create NpmsDashboards?
   *
   * @param arg
   */
  canCreate(): boolean {
    // is Admin or Manager or Creator
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.Create,
    ]);
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

    // can if Admin or Manager
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ])) {
      return true;
    };

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // can if Owner
    if (model.isOwnedBy(this.ctx.auth) && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.UpdateOwn])) {
      return true;
    }

    // can if Updater
    if (this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.UpdateAll])) {
      return true;
    }

    // failed
    return true;
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

    // can if Admin or Manager or SoftDeleteAller
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.SoftDeleteAll,
    ])) {
      return true;
    }

    // can if Owner & SoftDeleteOwner
    if (model.isOwnedBy(this.ctx.auth) && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.SoftDeleteOwn])) {
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

    // can if Admin or Manager or HardDeleter
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.HardDeleteAll,
    ])) {
      return true;
    }

    // can if Owner & HardDeleteOwner
    if (model.isOwnedBy(this.ctx.auth) && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.HardDeleteOwn])) {
      return true;
    }

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

    // can if Admin or Manager or RestoreAller
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.RestoreAll,
    ])) {
      return true;
    }

    // can if Owner & RestorOwner
    if (model.isOwnedBy(this.ctx.auth) && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.RestoreAll])) {
      return true;
    }

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

    // must be Draft
    if (!model.isDraft()) return false;

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

    // is Submitted
    if (!model.isSubmitted()) return false;

    // can if Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ]);
  }


  /**
   * Can the Requester Approve this NpmsDashboard?
   *
   * @param arg
   */
  canApprove(arg: {
    model: NpmsDashboardModel,
  }): boolean {
    const { model } = arg;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // must be Submitted
    if (!model.isSubmitted()) return false;

    // can if Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ]);
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

    // must be Approved
    if (!model.isApproved()) return false;

    // can if Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ]);
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

    // must be Publsihed
    if (!model.isPublished()) return false;

    // can if Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ]);
  }

}