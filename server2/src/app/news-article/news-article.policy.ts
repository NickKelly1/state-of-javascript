import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { Permission } from "../permission/permission.const";
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
    // is Admin or Manager or Shower
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
      Permission.NewsArticles.Show,
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
      && this.ctx.auth.hasAnyPermissions([Permission.NewsArticles.Show])
    ) {
      return true;
    }

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
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

    // is Admin or Manager or Creator
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
      Permission.NewsArticles.Create,
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
      && this.ctx.auth.hasAnyPermissions([Permission.NewsArticles.Update])
    ) {
      return true;
    };

    if (!model.isSoftDeleted()
      && Permission.NewsArticles.Update
    ) {
      return true;
    }

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Admin or Manager or SoftDeleter
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
      Permission.NewsArticles.SoftDelete,
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
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
      Permission.NewsArticles.HardDelete,
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

    // is not SoftDeleted
    if (!model.isSoftDeleted()) return false;

    // is Admin, Manager, or Restorer
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
      Permission.NewsArticles.Restore,
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is a Draft
    if (!model.isDraft()) return false;

    // have permission to Update
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // Is Submitted
    if (!model.isSubmitted()) return false;

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;


    // is Submitted
    if (!model.isSubmitted()) return false;

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Approved
    if (!model.isApproved()) return false;

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Published
    if (!model.isPublished()) return false;

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
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

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Approved
    if (!model.isApproved()) return false;

    // is Admin or Manager
    return this.ctx.auth.hasAnyPermissions([
      Permission.SuperAdmin.SuperAdmin,
      Permission.NewsArticles.Manage,
    ]);
  }
}