import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";
import { NewsArticleModel } from "./news-article.model";

export class NewsArticlePolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the requester do something on NewsArticles?
   */
  canAccess(): boolean {
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
      Permission.NewsArticles.Writer,
      Permission.NewsArticles.Viewer,
    );
  }


  /**
   * Can the Requester Show NewsArticles?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access the domain
    if (!this.canAccess()) return false;

    // is News Admin|Manager|Writer|Viewer
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
      Permission.NewsArticles.Writer,
      Permission.NewsArticles.Viewer,
    );
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

    // can access the domain
    if (!this.canAccess()) return false;

    // is NewsArticleAdmin
    if (this.ctx.hasPermission(Permission.NewsArticles.Admin)) return true;

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is NewsArticleManager
    if (this.ctx.hasPermission(Permission.NewsArticles.Manager)) return true;

    // is Author and is Viewer|Writer
    if (
      model.ctxIsAuthor(this.ctx)
      && this.ctx.hasPermission(
        Permission.NewsArticles.Viewer,
        Permission.NewsArticles.Writer,
      )
    ) {
      return true;
    }

    // is Published & Requester is a Viewer
    if (model.isPublished() && this.ctx.hasPermission(Permission.NewsArticles.Viewer)) {
      return true;
    }

    // fail
    return false;
  }


  /**
   * Can the Requester Create NewsArticles?
   *
   * @param arg
   */
  canCreate(): boolean {

    // can access the domain
    if (!this.canAccess()) return false;

    // is News Admin|Writer|Manager|Writer
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Writer,
      Permission.NewsArticles.Manager,
      Permission.NewsArticles.Writer,
    );
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // is Admin|Manager
    if (this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
    )) {
      return true;
    }

    // is Author & Writer
    if (model.ctxIsAuthor(this.ctx)
      && this.ctx.hasPermission(Permission.NewsArticles.Writer)
    ) {
      return true;
    }

    // failed
    return false;
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is News Admin|Manager
    if (this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
    )) {
      return true;
    }

    // is Author & Writer
    if (model.ctxIsAuthor(this.ctx)
      && this.ctx.hasPermission(Permission.NewsArticles.Writer)
    ) {
      return true;
    }

    // failed
    return false;
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // is NewsAdmin
    return this.ctx.hasPermission(Permission.NewsArticles.Admin);
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

    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must be SoftDeleted
    if (!model.isSoftDeleted()) return false;

    // is NewsAdmin, Manager, or Restorer
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
    );
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // Is Submitted
    if (!model.isSubmitted()) return false;

    // is Admin|Manager
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
    );
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Submitted
    if (!model.isSubmitted()) return false;

    // is Admin|Manager
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
    );
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Approved
    if (!model.isApproved()) return false;

    // is Admin|Manager
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
    );
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Published
    if (!model.isPublished()) return false;

    // is Admin|Manager
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
    );
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

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is Approved
    if (!model.isApproved()) return false;

    // is Admin|Manager
    return this.ctx.hasPermission(
      Permission.NewsArticles.Admin,
      Permission.NewsArticles.Manager,
    );
  }
}