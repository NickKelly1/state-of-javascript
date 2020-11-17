import { NewsArticleModel } from '../../circle';
import { ist } from '../../common/helpers/ist.helper';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { NewsArticleStatus } from '../news-article-status/news-article-status.const';
import { UserModel } from '../user/user.model';
import { ICreateNewsArticleInput } from './dtos/create-news-article.gql';
import { IUpdateNewsArticleInput } from './dtos/update-news-article.gql';

export class NewsArticleService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Create a NewsArticle
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    author: UserModel,
    dto: ICreateNewsArticleInput,
  }): Promise<NewsArticleModel> {
    const { runner, author, dto } = arg;
    const { transaction } = runner;

    const NewsArticle = NewsArticleModel.build({
      author_id: author.id,
      status_id: NewsArticleStatus.Draft,
      scheduled_for: null,
      title: dto.title,
      teaser: dto.teaser,
      body: dto.body,
    });

    await NewsArticle.save({ transaction });
    return NewsArticle;
  }


  /**
   * Update the NewsArticle
   *
   * @param arg
   */
  async update(arg: {
    runner: QueryRunner;
    author: UserModel,
    model: NewsArticleModel;
    dto: IUpdateNewsArticleInput,
  }): Promise<NewsArticleModel> {
    const { runner, author, model, dto } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.title)) model.title = dto.title;
    if (ist.notUndefined(dto.teaser)) model.teaser = dto.teaser;
    if (ist.notUndefined(dto.body)) model.body = dto.body;
    await model.save({ transaction });
    return model;
  }


  /**
   * Delete the NewsArticle
   * 
   * @param arg
   */
  async delete(arg: {
    model: NewsArticleModel;
    author: UserModel,
    runner: QueryRunner;
  }): Promise<NewsArticleModel> {
    const { model, author, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }


  /**
   * Submit the news article for approval
   */
  async submit(arg: {
    model: NewsArticleModel;
    runner: QueryRunner;
  }): Promise<NewsArticleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = NewsArticleStatus.Submitted;
    await model.save({ transaction });
    return model;
  }


  /**
   * Reject the NewsArticle's Submission
   *
   * @param arg
   */
  async reject(arg: {
    model: NewsArticleModel;
    runner: QueryRunner;
  }): Promise<NewsArticleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = NewsArticleStatus.Rejected;
    await model.save({ transaction });
    return model;
  }


  /**
   * Approve the news article for publishing
   *
   * @param arg
   */
  async approve(arg: {
    model: NewsArticleModel;
    runner: QueryRunner;
  }): Promise<NewsArticleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = NewsArticleStatus.Approved;
    await model.save({ transaction });
    return model;
  }


  /**
   * Schedule the NewsArticle for Publishing
   *
   * @param arg
   */
  async schedule(arg: {
    model: NewsArticleModel;
    runner: QueryRunner;
    scheduled_for: Date;
  }): Promise<NewsArticleModel> {
    const { model, runner, scheduled_for } = arg;
    const { transaction } = runner;
    model.scheduled_for = scheduled_for;
    await model.save({ transaction });
    return model;
  }


  /**
   * Publish the NewsArticle
   *
   * @param arg
   */
  async publish(arg: {
    model: NewsArticleModel;
    runner: QueryRunner;
  }): Promise<NewsArticleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = NewsArticleStatus.Published;
    await model.save({ transaction });
    return model;
  }


  /**
   * Unpublish the NewsArticle
   *
   * @param arg
   */
  async unpublish(arg: {
    model: NewsArticleModel;
    runner: QueryRunner;
  }): Promise<NewsArticleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    model.status_id = NewsArticleStatus.Unpublished;
    await model.save({ transaction });
    return model;
  }
}
