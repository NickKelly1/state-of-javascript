import { BlogPostStatusModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";

export class BlogPostStatusPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Requester Access BlogPostStatuses?
   */
  canAccess(): boolean {
    return this.ctx.auth.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.BlogPostStatuses.Viewer,
    );
  }


  /**
   * Can the Requester FindMany BlogPostStatuses?
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    return this.ctx.auth.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.BlogPostStatuses.Viewer,
    );
  }

  /**
   * Can the Requester Find this BlogPostStatus?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: BlogPostStatusModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // has BlogPostStatusViewer
    return this.ctx.auth.hasPermission(Permission.BlogPostStatuses.Viewer);
  }
}
