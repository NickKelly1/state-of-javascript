import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";
import { NewsArticleStatusModel } from "./news-article-status.model";

export class NewsArticleStatusPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Can the Requester Access NewsArticleStatuses?
   */
  canAccess(): boolean {
    return this.ctx.auth.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticleStatuses.Viewer,
    );
  }


  /**
   * Can the Requester FindMany NewsArticleStatuses?
   */
  canFindMany(): boolean {

    // can access
    if (!this.canAccess()) return false;

    return this.ctx.auth.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticleStatuses.Viewer,
    );
  }

  /**
   * Can the Requester Find this NewsArticleStatus?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NewsArticleStatusModel;
  }): boolean {
    const { model } = arg;

    // can access
    if (!this.canAccess()) return false;

    // has NewsArticleStatusViewer
    return this.ctx.auth.hasPermission(Permission.NewsArticleStatuses.Viewer);
  }
}