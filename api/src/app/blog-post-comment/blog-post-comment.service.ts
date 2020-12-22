import { BlogPostCommentModel } from '../../circle';
import { BaseContext } from '../../common/context/base.context';
import { ist } from '../../common/helpers/ist.helper';
import { BlogPostModel } from '../blog-post/blog-post.model';
import { QueryRunner } from '../db/query-runner';
import { UserModel } from '../user/user.model';

export interface IBlogPostCommentServiceCreateBlogPostCommentDto {
  body: string;
}

export interface IBlogPostCommentServiceUpdateBlogPostCommentDto {
  body?: string;
  visible?: boolean;
  hidden?: boolean;
}

export class BlogPostCommentService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Create a BlogPostComment
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    author: UserModel;
    post: BlogPostModel;
    dto: IBlogPostCommentServiceCreateBlogPostCommentDto,
  }): Promise<BlogPostCommentModel> {
    const { runner, author, post, dto } = arg;
    const { transaction } = runner;

    const BlogPostComment = BlogPostCommentModel.build({
      author_id: author.id,
      body: dto.body,
      post_id: post.id,
      hidden: false,
      visible: true,
    });

    await BlogPostComment.save({ transaction });
    return BlogPostComment;
  }


  /**
   * Update the BlogPostComment
   *
   * @param arg
   */
  async update(arg: {
    runner: QueryRunner;
    post: BlogPostModel;
    author: UserModel;
    model: BlogPostCommentModel;
    dto: IBlogPostCommentServiceUpdateBlogPostCommentDto,
  }): Promise<BlogPostCommentModel> {
    const { runner, author, post, model, dto } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.body)) model.body = dto.body;
    if (ist.notUndefined(dto.hidden)) model.hidden = dto.hidden;
    if (ist.notUndefined(dto.visible)) model.visible = dto.visible;
    await model.save({ transaction });
    return model;
  }


  /**
   * SoftDelete the BlogPostComment
   * 
   * @param arg
   */
  async softDelete(arg: {
    model: BlogPostCommentModel;
    author: UserModel,
    post: BlogPostModel;
    runner: QueryRunner;
  }): Promise<BlogPostCommentModel> {
    const { model, author, post, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }


  /**
   * HardDelete the BlogPostComment
   * 
   * @param arg
   */
  async hardDelete(arg: {
    model: BlogPostCommentModel;
    author: UserModel,
    post: BlogPostModel;
    runner: QueryRunner;
  }): Promise<BlogPostCommentModel> {
    const { model, author, post, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction, force: true, });
    return model;
  }




  /**
   * Restore the BlogPostComment
   * 
   * @param arg
   */
  async restore(arg: {
    model: BlogPostCommentModel;
    author: UserModel,
    post: BlogPostModel;
    runner: QueryRunner;
  }): Promise<BlogPostCommentModel> {
    const { model, author, post, runner } = arg;
    const { transaction } = runner;
    await model.restore({ transaction });
    return model;
  }
}
