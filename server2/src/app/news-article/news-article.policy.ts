import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
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
    model: NewsArticleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle,
      Permission.CreateNewsArticle,
    ]);
  }

  canDelete(arg: {
    model: NewsArticleModel;
  }): boolean {
    const { model } = arg;
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle,
      Permission.CreateNewsArticle,
    ]);
  }
}