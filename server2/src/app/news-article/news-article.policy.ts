import { isatty } from "tty";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { NewsArticleStatus } from "../news-article-status/news-article-status.const";
import { Permission } from "../permission/permission.const";
import { UserModel } from "../user/user.model";
import { NewsArticleModel } from "./news-article.model";

export class NewsArticlePolicy {
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
      Permission.ManageNewsArticle,
      Permission.ShowNewsArticle,
    ]);
  }

  /**
   * Can the requester view this newsa article?
   *
   * @param arg
   */
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
      Permission.ManageNewsArticle,
      Permission.CreateNewsArticle,
    ]);
  }


  /**
   * Can the request update this news article?
   *
   * @param arg
   */
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

    // is author & is still a draft
    const isAuthor = this.ctx.auth.user_id === author.id;
    const isDraft = model.status_id === NewsArticleStatus.Draft;
    if (isAuthor && isDraft && this.ctx.auth.hasAnyPermissions([ Permission.UpdateNewsArticle ])) {
      return true;
    }

    return false;
  }

  /**
   * Can the requester delete this news article?
   *
   * @param arg
   */
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
    const isAuthor = model.author_id === this.ctx.auth.user_id;
    if (isAuthor && this.ctx.auth.hasAnyPermissions([ Permission.DeleteNewsArticle ])) {
      return true;
    }

    return false;
  }


  /**
   * Can the requester submit this news article?
   *
   * @param arg
   */
  canSubmit(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;

    // can only submit drafts
    if (model.status_id !== NewsArticleStatus.Draft) return false;

    // admin
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle
    ])) {
      return true;
    }

    // is author & has perm
    const isAuthor = model.author_id === this.ctx.auth.user_id;
    if (isAuthor && this.ctx.auth.hasAnyPermissions([Permission.CreateNewsArticle])) {
      return true;
    }

    return false;
  }


  /**
   * Can the requester reject this news article?
   *
   * @param arg
   */
  canReject(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;


    // can only reject submitted articles
    if (model.status_id !== NewsArticleStatus.Submitted) return false;

    // admin
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle
    ])) {
      return true;
    }

    return false;
    //
  }


  /**
   * Can the requester approve this news article?
   *
   * @param arg
   */
  canApprove(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;


    // can only approve submitted articles
    if (model.status_id !== NewsArticleStatus.Submitted) return false;

    // admin
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle
    ])) {
      return true;
    }

    return false;
  }


  /**
   * Can the requester publish this news article
   * 
   * @param arg
   */
  canPublish(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;

    // can only submit drafts
    if (model.status_id !== NewsArticleStatus.Approved) return false;

    // admin
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle
    ])) {
      return true;
    }

    return false;
  }


  /**
   * Can the requester unpublish this news article?
   *
   * @param arg
   */
  canUnpublish(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;

    // can only unpublish published articles
    if (model.status_id !== NewsArticleStatus.Published) return false;

    // admin
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle
    ])) {
      return true;
    }

    return false;
  }


  /**
   * Can the requester schedule this news article for publication?
   *
   * @param arg
   */
  canSchedule(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;

    // can only submit drafts
    if (model.status_id !== NewsArticleStatus.Approved) return false;

    // admin
    if (this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticle
    ])) {
      return true;
    }

    return false;
  }
}