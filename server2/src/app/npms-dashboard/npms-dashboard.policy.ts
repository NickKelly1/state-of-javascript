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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
      Permission.ShowNpmsDashboards,
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
      && this.ctx.auth.hasAnyPermissions([Permission.ShowNpmsDashboards])
    ) {
      return true;
    }

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
      Permission.CreateNpmsDashboards,
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
      && this.ctx.auth.hasAnyPermissions([Permission.UpdateOwnNpmsDashboards])
    ) {
      return true;
    }

    if (
      !model.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.UpdateNpmsDashboards])
    ) {
      return true;
    }

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
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
    if (model.isSoftDeleted()) return false;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
      Permission.SoftDeleteNpmsDashboards,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
      Permission.HardDeleteNpmsDashboards,
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
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
      Permission.RestoreNpmsDashboards,
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
    if (model.isSoftDeleted()) return false;
    // can only submit drafts
    if (!model.isDraft()) return false;
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
    if (model.isSoftDeleted()) return false;
    // can only reject submitted articles
    if (!model.isSubmitted()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards
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
    if (model.isSoftDeleted()) return false;
    // can only approve submitted articles
    if (!model.isSubmitted()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards
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
    if (model.isSoftDeleted()) return false;
    if (!model.isApproved()) return false;

    // admin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
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
    if (model.isSoftDeleted()) return false;
    if (!model.isPublished()) return false;

    // admin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboards,
    ]);
  }

}