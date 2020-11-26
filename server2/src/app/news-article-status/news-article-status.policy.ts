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

  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticleStatuses.Show,
    ]);
  }

  canFindOne(arg: {
    model: NewsArticleStatusModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticleStatuses.Show,
    ]);
  }
}