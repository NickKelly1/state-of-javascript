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
      Permission.NpmsDashboards.Show,
    ]);
  }


  /**
   * Can the Requester Show this NpmsDashboard?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;

    if (!model.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.Show])
    ) {
      return true;
    }

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ]);
  }


  /**
   * Can the Requester Sort NpmsDashboards?
   *
   * @param arg
   */
  canSort(arg?: {
    //
  }): boolean {

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
  canCreate(arg?: {
    //
  }): boolean {

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

    if (
      !model.isSoftDeleted()
      && this.ctx.auth.isMeByUserId(model.owner_id)
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.UpdateOwn])
    ) {
      return true;
    }

    if (
      !model.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.NpmsDashboards.Update])
    ) {
      return true;
    }

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ]);
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Admin or Manager or SoftDeleter
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.SoftDelete,
    ]);
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

    // is Admin or Manager or HardDeleter
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.HardDelete,
    ]);
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

    // is Admin or Manager or Restorer
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
      Permission.NpmsDashboards.Restore,
    ]);
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Draft
    if (!model.isDraft()) return false;

    // can also Update
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Submitted
    if (!model.isSubmitted()) return false;

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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Submitted
    if (!model.isSubmitted()) return false;

    // is Admin or Manager
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Approved
    if (!model.isApproved()) return false;

    // is Admin or Manager
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

    // is SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Publsihed
    if (!model.isPublished()) return false;

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NpmsDashboards.Manage,
    ]);
  }

}