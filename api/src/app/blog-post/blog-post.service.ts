import { BlogPostModel } from '../../circle';
import { BaseContext } from '../../common/context/base.context';
import { ist } from '../../common/helpers/ist.helper';
import { BlogPostStatus } from '../blog-post-status/blog-post-status.const';
import { QueryRunner } from '../db/query-runner';
import { UserModel } from '../user/user.model';
import { ICreateBlogPostInput } from './dtos/create-blog-post.gql.input';
import { IUpdateBlogPostInput } from './dtos/update-blog-post.gql.input';

export class BlogPostService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Create a BlogPost
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    author: UserModel,
    dto: ICreateBlogPostInput,
  }): Promise<BlogPostModel> {
    const { runner, author, dto } = arg;
    const { transaction } = runner;

    const BlogPost = BlogPostModel.build({
      author_id: author.id,
      status_id: BlogPostStatus.Draft,
      title: dto.title,
      teaser: dto.teaser,
      body: dto.body,
    });

    await BlogPost.save({ transaction });
    return BlogPost;
  }


  /**
   * Update the BlogPost
   *
   * @param arg
   */
  async update(arg: {
    runner: QueryRunner;
    author: UserModel,
    model: BlogPostModel;
    dto: IUpdateBlogPostInput,
  }): Promise<BlogPostModel> {
    const { runner, author, model, dto } = arg;
    const { transaction } = runner;
    if (ist.notNullable(dto.title)) model.title = dto.title;
    if (ist.notNullable(dto.teaser)) model.teaser = dto.teaser;
    if (ist.notNullable(dto.body)) model.body = dto.body;
    await model.save({ transaction });
    return model;
  }


  /**
   * SoftDelete the BlogPost
   * 
   * @param arg
   */
  async softDelete(arg: {
    model: BlogPostModel;
    author: UserModel,
    runner: QueryRunner;
  }): Promise<BlogPostModel> {
    const { model, author, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }


  /**
   * HardDelete the BlogPost
   * 
   * @param arg
   */
  async hardDelete(arg: {
    model: BlogPostModel;
    author: UserModel,
    runner: QueryRunner;
  }): Promise<BlogPostModel> {
    const { model, author, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction, force: true });
    return model;
  }


  /**
   * Restore the BlogPost
   * 
   * @param arg
   */
  async restore(arg: {
    model: BlogPostModel;
    author: UserModel,
    runner: QueryRunner;
  }): Promise<BlogPostModel> {
    const { model, author, runner } = arg;
    const { transaction } = runner;
    await model.restore({ transaction, });
    return model;
  }


  /**
   * Submit the news article for approval
   */
  async submit(arg: {
    model: BlogPostModel;
    runner: QueryRunner;
  }): Promise<BlogPostModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = BlogPostStatus.Submitted;
    await model.save({ transaction });
    return model;
  }


  /**
   * Reject the BlogPost's Submission
   *
   * @param arg
   */
  async reject(arg: {
    model: BlogPostModel;
    runner: QueryRunner;
  }): Promise<BlogPostModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = BlogPostStatus.Rejected;
    await model.save({ transaction });
    return model;
  }


  /**
   * Approve the news article for publishing
   *
   * @param arg
   */
  async approve(arg: {
    model: BlogPostModel;
    runner: QueryRunner;
  }): Promise<BlogPostModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = BlogPostStatus.Approved;
    await model.save({ transaction });
    return model;
  }


  /**
   * Publish the BlogPost
   *
   * @param arg
   */
  async publish(arg: {
    model: BlogPostModel;
    runner: QueryRunner;
  }): Promise<BlogPostModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = BlogPostStatus.Published;
    await model.save({ transaction });
    return model;
  }


  /**
   * Unpublish the BlogPost
   *
   * @param arg
   */
  async unpublish(arg: {
    model: BlogPostModel;
    runner: QueryRunner;
  }): Promise<BlogPostModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = BlogPostStatus.Unpublished;
    await model.save({ transaction });
    return model;
  }
}
