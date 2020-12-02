import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { Permission } from "../permission/permission.const";
import { UserModel } from "../user/user.model";
import { NewsArticleStatusModel } from "./news-article-status.model";

export class NewsArticleStatusPolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  /**
   * Can the Requester find NewsArticleStatuses?
   */
  canFindMany(): boolean {
    return this.ctx.auth.hasPermission(
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticleStatuses.Viewer,
    );
  }

  /**
   * Can the Requester find this NewsArticleStatus?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NewsArticleStatusModel;
  }): boolean {
    const { model } = arg;

    // has NewsArticleStatusViewer
    return this.ctx.auth.hasPermission(Permission.NewsArticleStatuses.Viewer);
  }
}