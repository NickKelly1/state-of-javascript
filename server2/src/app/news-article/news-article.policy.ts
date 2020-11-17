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
   * Can the Requester Show NewsArticles?
   *
   * @param arg
   */
  canFindMany(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
      Permission.ShowNewsArticles,
    ]);
  }


  /**
   * Can the Requester Show this NewsArticle?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: NewsArticleModel;
  }): boolean {
    const { model } = arg;

    const isAuthor = this.ctx.auth.isMeByUserId(model.author_id);
    if (
      isAuthor
      && !model.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.ShowNewsArticles])
    ) {
      return true;
    }

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
    ]);
  }


  /**
   * Can the Requester Create NewsArticles?
   *
   * @param arg
   */
  canCreate(arg?: {
    //
  }): boolean {
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
      Permission.CreateNewsArticles,
    ]);
  }


  /**
   * Can the Request Update this NewsArticle?
   *
   * @param arg
   */
  canUpdate(arg: {
    model: NewsArticleModel;
  }): boolean {
    const { model } = arg;

    const isAuthor = this.ctx.auth.isMeByUserId(model.author_id);
    if (isAuthor
      && !model.isSoftDeleted()
      && this.ctx.auth.hasAnyPermissions([Permission.UpdateOwnNewsArticles])
    ) {
      return true;
    };

    if (!model.isSoftDeleted()
      && Permission.UpdateNewsArticles
    ) {
      return true;
    }

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
    ]);
  }


  /**
   * Can the Requester SoftDelete this NewsArticle?
   *
   * @param arg
   */
  canSoftDelete(arg: {
    model: NewsArticleModel;
  }): boolean {
    const { model } = arg;
    if (model.isSoftDeleted()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
      Permission.SoftDeleteDeleteNewsArticles,
    ]);
  }


  /**
   * Can the Requester HardDelete this NewsArticle?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: NewsArticleModel
  }): boolean {
    const { model } = arg;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
      Permission.HardDeleteDeleteNewsArticles,
    ]);
  }


  /**
   * Can the Requester Restore this NewsArticle?
   *
   * @param arg
   */
  canRestore(arg: {
    model: NewsArticleModel;
  }): boolean {
    const { model } = arg;
    if (!model.isSoftDeleted()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
      Permission.RestoreNewsArticles,
    ]);
  }


  /**
   * Can the Requester Submit this NewsArticle?
   *
   * @param arg
   */
  canSubmit(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;
    if (model.isSoftDeleted()) return false;
    // can only submit drafts
    if (!model.isDraft()) return false;
    return this.canUpdate({ model });
  }


  /**
   * Can the requester Reject this NewsArticle?
   *
   * @param arg
   */
  canReject(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;
    if (model.isSoftDeleted()) return false;
    // can only reject submitted articles
    if (!model.isSubmitted()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles
    ]);
  }


  /**
   * Can the requester Approve this NewsArticle?
   *
   * @param arg
   */
  canApprove(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;
    if (model.isSoftDeleted()) return false;
    // can only approve submitted articles
    if (!model.isSubmitted()) return false;

    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles
    ]);
  }


  /**
   * Can the Requester Publish this NewsArticle
   * 
   * @param arg
   */
  canPublish(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;
    if (model.isSoftDeleted()) return false;
    if (!model.isApproved()) return false;

    // admin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
    ]);
  }


  /**
   * Can the requester Unpublish this NewsArticle?
   *
   * @param arg
   */
  canUnpublish(arg: {
    model: NewsArticleModel,
  }): boolean {
    const { model } = arg;
    if (model.isSoftDeleted()) return false;
    if (!model.isPublished()) return false;

    // admin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles,
    ]);
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
    if (model.isSoftDeleted()) return false;
    if (!model.isApproved()) return false;

    // admin
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin,
      Permission.ManageNewsArticles
    ]);
  }
}