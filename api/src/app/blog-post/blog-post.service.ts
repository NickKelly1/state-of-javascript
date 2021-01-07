import { FileUpload } from 'graphql-upload';
import { BlogPostModel } from '../../circle';
import { BaseContext } from '../../common/context/base.context';
import { ist } from '../../common/helpers/ist.helper';
import { OrNullable } from '../../common/types/or-nullable.type';
import { BlogPostStatus } from '../blog-post-status/blog-post-status.const';
import { QueryRunner } from '../db/query-runner';
import { UserModel } from '../user/user.model';

export interface IBlogPostServiceCreateBlogPostDto {
  title: string;
  teaser: string;
  body: string;
  image: {
    encoding: string;
    mimetype: string;
    extension: string;
    file: string;
    title: string;
  }
}

export interface IBlogPostServiceUpdateBlogPostDto {
  id: number;
  title?: OrNullable<string>;
  teaser?: OrNullable<string>;
  body?: OrNullable<string>;
  image?: OrNullable<Promise<FileUpload>>;
}


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
    dto: IBlogPostServiceCreateBlogPostDto,
  }): Promise<BlogPostModel> {
    const { runner, author, dto } = arg;
    const { transaction } = runner;

    // create the image
    const image = await this.ctx.services.imageService.create({ runner, dto: {
      encoding: dto.image.encoding,
      extension: dto.image.extension,
      mimetype: dto.image.mimetype,
      title: dto.image.title,
      in_file: dto.image.file,
      is_public: false,
      mv: true,
      uploader: {
        aid: this.ctx.auth.aid,
        user_id: this.ctx.auth.user_id ?? null,
      },
    }, });

    // create the blog post
    const BlogPost = BlogPostModel.build({
      image_id: image.id,
      author_id: author.id,
      status_id: BlogPostStatus.Draft,
      title: dto.title,
      teaser: dto.teaser,
      body: dto.body,
    });

    // save blog post
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
    dto: IBlogPostServiceUpdateBlogPostDto,
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
