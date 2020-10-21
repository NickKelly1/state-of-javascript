import { NewsArticleModel } from '../../circle';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { UserModel } from '../user/user.model';
import { ICreateNewsArticleInput } from './dtos/create-news-article.gql';

export class NewsArticleService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async create(arg: {
    runner: QueryRunner;
    author: UserModel,
    dto: ICreateNewsArticleInput,
  }): Promise<NewsArticleModel> {
    const { runner, author, dto } = arg;
    const { transaction } = runner;

    const NewsArticle = NewsArticleModel.build({
      author_id: author.id,
      title: dto.title,
      teaser: dto.teaser,
      body: dto.body,
    });

    await NewsArticle.save({ transaction });
    return NewsArticle;
  }


  async delete(arg: {
    model: NewsArticleModel;
    runner: QueryRunner;
  }): Promise<NewsArticleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}
