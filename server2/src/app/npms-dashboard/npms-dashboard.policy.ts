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
   * Can the requester view many news articles?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboard,
      Permission.ShowNpmsDashboard,
    ]);
  }

  /**
   * Can the requester view this newsa article?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboard,
      Permission.ShowNpmsDashboard,
    ]);
  }

  /**
   * Can the requester create this news article?
   *
   * @param arg
   */
  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboard,
      Permission.CreateNpmsDashboard,
    ]);
  }


  /**
   * Can the request update this news article?
   *
   * @param arg
   */
  canUpdate(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboard,
      Permission.UpdateNpmsDashboard,
    ]);
  }

  /**
   * Can the requester delete this news article?
   *
   * @param arg
   */
  canDelete(arg: {
    model: NpmsDashboardModel;
  }): boolean {
    const { model } = arg;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboard,
      Permission.DeleteNpmsDashboard,
    ]);
  }
}