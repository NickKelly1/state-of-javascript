import { BlogPostCommentModel } from "../../circle";
import { BaseContext } from "../../common/context/base.context";
import { BlogPostModel } from "../blog-post/blog-post.model";
import { Permission } from "../permission/permission.const";

export class BlogPostCommentPolicy {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Can the Access BlogPostComments?
   *
   * @param arg
   */
  canAccess(): boolean {

    // is News Admin|Manager|Writer|Viewer
    return this.ctx.hasPermission(
      Permission.BlogPostComments.Admin,
      Permission.BlogPostComments.Manager,
      Permission.BlogPostComments.Writer,
      Permission.BlogPostComments.Viewer,
    );
  }


  /**
   * Can the Requester Show BlogPostComments?
   *
   * @param arg
   */
  canFindMany(): boolean {

    // can access the domain
    if (!this.canAccess()) return false;

    // is News Admin|Manager|Writer|Viewer
    return this.ctx.hasPermission(
      Permission.BlogPostComments.Admin,
      Permission.BlogPostComments.Manager,
      Permission.BlogPostComments.Writer,
      Permission.BlogPostComments.Viewer,
    );
  }


  /**
   * Can the Requester Show BlogPostComments for BlogPost?
   *
   * @param arg
   */
  canFindManyForBlogPost(arg: {
    post: BlogPostModel;
  }): boolean {
    const { post, } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // blogPost must be findable
    if (!this.ctx.services.blogPostPolicy.canFindOne({ model: post, })) return false;

    return this.canFindMany();
  }


  /**
   * Can the Requester Show this BlogPostComment?
   *
   * @param arg
   */
  canFindOne(arg: {
    model: BlogPostCommentModel;
    post: BlogPostModel;
  }): boolean {
    const { model, post, } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // BlogPost must be Findable
    if (!this.ctx.services.blogPostPolicy.canFindOne({ model: post })) return false;

    // is BlogPostCommentAdmin
    if (this.ctx.hasPermission(Permission.BlogPostComments.Admin)) return true;

    // is not SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is BlogPostCommentManager
    if (this.ctx.hasPermission(Permission.BlogPostComments.Manager)) return true;

    // must be visible
    if (!model.isVisible()) return false;

    // must be viewer
    if (this.ctx.hasPermission(Permission.BlogPostComments.Viewer)) return true;

    // fail
    return false;
  }


  /**
   * Can the Requester Create BlogPostComments?
   *
   * @param arg
   */
  canCreate(): boolean {

    // can access the domain
    if (!this.canAccess()) return false;

    // is News Admin|Writer|Manager
    return this.ctx.hasPermission(
      Permission.BlogPostComments.Admin,
      Permission.BlogPostComments.Writer,
      Permission.BlogPostComments.Manager,
    );
  }


  /**
   * Can the Requester Create BlogPostComments for the BlogPost?
   *
   * @param arg
   */
  canCreateForBlogPost(arg: {
    post: BlogPostModel;
  }): boolean {
    const { post } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // BlogPost must be Findable
    if (!this.ctx.services.blogPostPolicy.canFindOne({ model: post })) return false;

    return this.canCreate();
  }


  /**
   * Can the Request Update this BlogPostComment?
   *
   * @param arg
   */
  canUpdate(arg: {
    post: BlogPostModel;
    model: BlogPostCommentModel;
  }): boolean {
    const { model, post } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model, post, })) return false;

    // is Admin|Manager
    if (this.ctx.hasPermission(
      Permission.BlogPostComments.Admin,
      Permission.BlogPostComments.Manager,
    )) {
      return true;
    }

    // is Author & Writer
    if (model.ctxIsAuthor(this.ctx)
      && this.ctx.hasPermission(Permission.BlogPostComments.Writer)
    ) {
      return true;
    }

    // failed
    return false;
  }


  /**
   * Can the Requester SoftDelete this BlogPostComment?
   *
   * @param arg
   */
  canSoftDelete(arg: {
    model: BlogPostCommentModel;
    post: BlogPostModel;
  }): boolean {
    const { model, post } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model, post, })) return false;

    // must not be SoftDeleted
    if (model.isSoftDeleted()) return false;

    // is News Admin|Manager
    if (this.ctx.hasPermission(
      Permission.BlogPostComments.Admin,
      Permission.BlogPostComments.Manager,
    )) {
      return true;
    }

    // is Author & Writer
    if (model.ctxIsAuthor(this.ctx)
      && this.ctx.hasPermission(Permission.BlogPostComments.Writer)
    ) {
      return true;
    }

    // failed
    return false;
  }


  /**
   * Can the Requester HardDelete this BlogPostComment?
   *
   * @param arg
   */
  canHardDelete(arg: {
    model: BlogPostCommentModel;
    post: BlogPostModel;
  }): boolean {
    const { model, post } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ model, post, })) return false;

    // is NewsAdmin
    return this.ctx.hasPermission(Permission.BlogPostComments.Admin);
  }


  /**
   * Can the Requester Restore this BlogPostComment?
   *
   * @param arg
   */
  canRestore(arg: {
    model: BlogPostCommentModel;
    post: BlogPostModel;
  }): boolean {
    const { model, post, } = arg;

    // must be Findable
    if (!this.canFindOne({ model, post, })) return false;

    // must be SoftDeleted
    if (!model.isSoftDeleted()) return false;

    // is Admin|Manager
    return this.ctx.hasPermission(
      Permission.BlogPostComments.Admin,
      Permission.BlogPostComments.Manager,
    );
  }


  /**
   * Can the Requester Hide this BlogPostComment?
   *
   * @param arg
   */
  canHide(arg: {
    model: BlogPostCommentModel;
    post: BlogPostModel;
  }): boolean {
    const { model, post, } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ post: post, model })) return false;

    // is News Admin|Manager
    return this.ctx.hasPermission(
      Permission.BlogPostComments.Admin,
      Permission.BlogPostComments.Manager,
    );
  }


  /**
   * Can the Requester Vanish this BlogPostComment?
   *
   * @param arg
   */
  canVanish(arg: {
    model: BlogPostCommentModel;
    post: BlogPostModel;
  }): boolean {
    const { model, post, } = arg;

    // can access the domain
    if (!this.canAccess()) return false;

    // must be Findable
    if (!this.canFindOne({ post, model })) return false;

    // is News Admin|Manager
    return this.ctx.hasPermission(
      Permission.BlogPostComments.Admin,
      Permission.BlogPostComments.Manager,
    );
  }
}