import { Includeable, ModelCtor, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrArray } from "../../common/types/or-array.type";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { QueryRunner } from "../db/query-runner";
import { INewsArticleCollectionGqlNodeSource } from "./gql/news-article.collection.gql.node";
import { NewsArticleAssociation } from "./news-article.associations";
import { NewsArticleLang } from "./news-article.lang";
import { NewsArticleModel } from "./news-article.model";


export class NewsArticleRepository extends BaseRepository<NewsArticleModel> {
  protected readonly Model = NewsArticleModel as ModelCtor<NewsArticleModel>;

  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return NewsArticleLang.NotFound;
  }

  /**
   * Find a GraphQL Collection of NewsArticle
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<NewsArticleModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<INewsArticleCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include, } = arg;
    const { page, queryOptions } = this.transformGqlCollectionQuery({ args, });
    const { rows, count } = await this.findAllAndCount({
      runner,
      options: {
        ...queryOptions,
        where: andWhere([ where, queryOptions.where, ]),
        include: concatIncludables([
          include,
          [
            { association: NewsArticleAssociation.status, },
            { association: NewsArticleAssociation.author, },
          ],
        ]),
      },
    });
    const pagination = collectionMeta({ data: rows, total: count, page });

    // prime statuses...
    rows
      .map(row => assertDefined(row.status))
      .forEach(status => ctx.loader.newsArticleStatuses.prime(status.id, status));

    // prime authors...
    rows
      .map(row => assertDefined(row.author))
      .forEach(author => ctx.loader.users.prime(author.id, author));

    const collection: INewsArticleCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<NewsArticleModel> =>
        ctx.services.newsArticlePolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };

    return collection;
  }
}