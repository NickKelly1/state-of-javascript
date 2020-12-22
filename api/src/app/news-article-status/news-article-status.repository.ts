import { Includeable, ModelCtor, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { NewsArticleStatusModel } from "./news-article-status.model";
import { NewsArticleStatusLang } from './news-article-status.lang';
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrArray } from "../../common/types/or-array.type";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { QueryRunner } from "../db/query-runner";
import { INewsArticleStatusCollectionGqlNodeSource } from "./gql/news-article-status.collection.gql.node";


export class NewsArticleStatusRepository extends BaseRepository<NewsArticleStatusModel> {
  protected readonly Model = NewsArticleStatusModel as ModelCtor<NewsArticleStatusModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return NewsArticleStatusLang.NotFound;
  }


  /**
   * Find a GraphQL Collection of NewsArticleStatuses
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<NewsArticleStatusModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<INewsArticleStatusCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include, } = arg;
    const { page, queryOptions } = this.transformGqlCollectionQuery({ args, });

    const { rows, count } = await this.findAllAndCount({
      runner,
      options: {
        ...queryOptions,
        where: andWhere([
          where,
          queryOptions.where,
        ]),
        include: concatIncludables([
          include,
          queryOptions.include,
        ]),
      },
    });

    const pagination = collectionMeta({ data: rows, total: count, page });
    const collection: INewsArticleStatusCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<NewsArticleStatusModel> =>
        ctx.services.newsArticleStatusPolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };

    return collection;
  }
}