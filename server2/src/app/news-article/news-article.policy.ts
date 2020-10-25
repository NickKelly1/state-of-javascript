import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { Permission } from "../permission/permission.const";
import { UserModel } from "../user/user.model";
import { NewsArticleModel } from "./news-article.model";

export class NewsArticlePolicy {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle,
      Permission.ShowNewsArticle,
    ]);
  }

  canFindOne(arg: {
    model: NewsArticleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle,
      Permission.ShowNewsArticle,
    ]);
  }

  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle,
      Permission.CreateNewsArticle,
    ]);
  }

  canUpdate(arg: {
    author: OrNullable<UserModel>;
    model: NewsArticleModel;
  }): boolean {
    const { author, model } = arg;

    // admin
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle,
    ])) {
      return true;
    };

    if (!author) return false;

    // is author
    if (this.ctx.auth.hasAnyPermissions([ Permission.UpdateNewsArticle ])
      && this.ctx.auth.user_id === author.id
    ) {
      return true;
    }

    return false;
  }

  canDelete(arg: {
    author: OrNullable<UserModel>;
    model: NewsArticleModel;
  }): boolean {
    const { author, model } = arg;

    // admin
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle,
    ])) {
      return true;
    };

    if (!author) return false;

    // is author
    if (this.ctx.auth.hasAnyPermissions([ Permission.DeleteNewsArticle ])
      && this.ctx.auth.user_id === author.id
    ) {
      return true;
    }

    return false;
  }
}