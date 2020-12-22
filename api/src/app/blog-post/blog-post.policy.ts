import { BlogPostModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { Permission } from "../permission/permission.const";

export class BlogPostPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Requester Access BlogPosts?
   *
   * @param arg
   */
  canAccess(): boolean {

    // is News Admin|Manager|Writer|Viewer
    return this.ctx.hasPermission(
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
      Permission.BlogPosts.Writer,
      Permission.BlogPosts.Viewer,
    );
  }



  /**
   * Can the Requester Show BlogPosts?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access the domain
    if (!this.canAccess()) return false;

    // is News Admin|Manager|Writer|Viewer
    return this.ctx.hasPermission(
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
      Permission.BlogPosts.Writer,
      Permission.BlogPosts.Viewer,
    );
  }


  /**
   * Can the Requester Show this BlogPost?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: BlogPostModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // is BlogPostAdmin
    if (this.ctx.hasPermission(Permission.BlogPosts.Admin)) return true;

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is BlogPostManager
    if (this.ctx.hasPermission(Permission.BlogPosts.Manager)) return true;

    // is Author and is Viewer|Writer
    if (
      model.ctxIsAuthor(this.ctx)
      && this.ctx.hasPermission(
        Permission.BlogPosts.Viewer,
        Permission.BlogPosts.Writer,
      )
    ) {
      return true;
    }

    // is Published & Requester is a Viewer
    if (model.isPublished() && this.ctx.hasPermission(Permission.BlogPosts.Viewer)) {
      return true;
    }

    // fail
    return false;
  }


  /**
   * Can the Requester Create BlogPosts?
   *
   * @param arg
   */
  canCreate(): boolean {

    // can access the domain
    if (!this.canAccess()) return false;

    // is News Admin|Writer|Manager
    return this.ctx.hasPermission(
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Writer,
      Permission.BlogPosts.Manager,
    );
  }


  /**
   * Can the Request Update this BlogPost?
   *
   * @param arg
   */
  canUpdate(arg: {
    model: BlogPostModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // is Admin|Manager
    if (this.ctx.hasPermission(
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
    )) {
      return true;
    }

    // is Author & Writer
    if (model.ctxIsAuthor(this.ctx)
      && this.ctx.hasPermission(Permission.BlogPosts.Writer)
    ) {
      return true;
    }

    // failed
    return false;
  }


  /**
   * Can the Requester SoftDelete this BlogPost?
   *
   * @param arg
   */
  canSoftDelete(arg: {
    model: BlogPostModel;
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
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
    )) {
      return true;
    }

    // is Author & Writer
    if (model.ctxIsAuthor(this.ctx)
      && this.ctx.hasPermission(Permission.BlogPosts.Writer)
    ) {
      return true;
    }

    // failed
    return false;
  }


  /**
   * Can the Requester HardDelete this BlogPost?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: BlogPostModel
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // is NewsAdmin
    return this.ctx.hasPermission(Permission.BlogPosts.Admin);
  }


  /**
   * Can the Requester Restore this BlogPost?
   *
   * @param arg
   */
  canRestore(arg: {
    model: BlogPostModel;
  }): boolean {
    const { model } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model })) return false;

    // must be SoftDeleted
    if (!model.isSoftDeleted()) return false;

    // is NewsAdmin, Manager, or Restorer
    return this.ctx.hasPermission(
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
    );
  }


  /**
   * Can the Requester Submit this BlogPost?
   *
   * @param arg
   */
  canSubmit(arg: {
    model: BlogPostModel,
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
   * Can the requester Reject this BlogPost?
   *
   * @param arg
   */
  canReject(arg: {
    model: BlogPostModel,
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
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
    );
  }


  /**
   * Can the requester Approve this BlogPost?
   *
   * @param arg
   */
  canApprove(arg: {
    model: BlogPostModel,
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
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
    );
  }


  /**
   * Can the Requester Publish this BlogPost
   * 
   * @param arg
   */
  canPublish(arg: {
    model: BlogPostModel,
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
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
    );
  }


  /**
   * Can the requester Unpublish this BlogPost?
   *
   * @param arg
   */
  canUnpublish(arg: {
    model: BlogPostModel,
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
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
    );
  }


  /**
   * Can the requester schedule this news article for publication?
   *
   * @param arg
   */
  canSchedule(arg: {
    model: BlogPostModel,
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
      Permission.BlogPosts.Admin,
      Permission.BlogPosts.Manager,
    );
  }
}