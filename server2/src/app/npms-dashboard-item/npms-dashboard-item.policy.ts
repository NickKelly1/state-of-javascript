import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
import { NpmsDashboardItemModel } from "./npms-dashboard-item.model";

export class NpmsDashboardItemPolicy {
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
      Permission.ManageNpmsDashboardItem,
      Permission.ShowNpmsDashboardItem,
    ]);
  }

  /**
   * Can the requester view this newsa article?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NpmsDashboardItemModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboardItem,
      Permission.ShowNpmsDashboardItem,
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
      Permission.ManageNpmsDashboardItem,
      Permission.CreateNpmsDashboardItem,
    ]);
  }


  /**
   * Can the request update this news article?
   *
   * @param arg
   */
  canUpdate(arg: {
    model: NpmsDashboardItemModel;
  }): boolean {
    const { model } = arg;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboardItem,
      Permission.UpdateNpmsDashboardItem,
    ]);
  }

  /**
   * Can the requester delete this news article?
   *
   * @param arg
   */
  canDelete(arg: {
    model: NpmsDashboardItemModel;
  }): boolean {
    const { model } = arg;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNpmsDashboardItem,
      Permission.DeleteNpmsDashboardItem,
    ]);
  }
}