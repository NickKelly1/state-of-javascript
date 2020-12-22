import { Includeable, ModelCtor, WhereOptions } from "sequelize";
import { BlogPostStatusModel } from "../../circle";
import { BaseRepository } from "../../common/classes/base.repository";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrArray } from "../../common/types/or-array.type";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { QueryRunner } from "../db/query-runner";
import { IBlogPostStatusCollectionGqlNodeSource } from "./gql/blog-post-status.collection.gql.node";
import { BlogPostStatusLang } from './blog-post-status.lang';


export class BlogPostStatusRepository extends BaseRepository<BlogPostStatusModel> {
  protected readonly Model = BlogPostStatusModel as ModelCtor<BlogPostStatusModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return BlogPostStatusLang.NotFound;
  }


  /**
   * Find a GraphQL Collection of BlogPostStatuses
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<BlogPostStatusModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<IBlogPostStatusCollectionGqlNodeSource> {
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
    const collection: IBlogPostStatusCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<BlogPostStatusModel> =>
        ctx.services.blogPostStatusPolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };

    return collection;
  }
}
