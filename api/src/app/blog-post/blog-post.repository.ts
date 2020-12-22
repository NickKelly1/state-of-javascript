import { Includeable, ModelCtor, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrNull } from "../../common/types/or-null.type";
import { QueryRunner } from "../db/query-runner";
import { BlogPostAssociation } from "./blog-post.associations";
import { BlogPostModel } from "./blog-post.model";
import { IBlogPostCollectionGqlNodeSource } from './gql/blog-post.collection.gql.node';
import { BlogPostLang } from './blog-post.lang';
import { OrNullable } from "../../common/types/or-nullable.type";
import { OrArray } from "../../common/types/or-array.type";


export class BlogPostRepository extends BaseRepository<BlogPostModel> {
  protected readonly Model = BlogPostModel as ModelCtor<BlogPostModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return BlogPostLang.NotFound;
  }


  /**
   * Find a GraphQL Collection of BlogPost
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where: OrNull<WhereOptions<BlogPostModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<IBlogPostCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include, } = arg;
    const { page, queryOptions } = this.transformGqlCollectionQuery({ args, });
    const { rows, count } = await ctx.services.blogPostRepository.findAllAndCount({
      runner,
      options: {
        ...queryOptions,
        where: andWhere([ where, queryOptions.where, ]),
        include: concatIncludables([
          include,
          queryOptions.include,
          [
            { association: BlogPostAssociation.status, },
            { association: BlogPostAssociation.author, },
          ],
        ]),
      },
    });
    const pagination = collectionMeta({ data: rows, total: count, page });

    // prime statuses...
    rows
      .map(row => assertDefined(row.status))
      .forEach(status => ctx.loader.blogPostStatus.prime(status.id, status));

    // prime authors...
    rows
      .map(row => assertDefined(row.author))
      .forEach(author => ctx.loader.users.prime(author.id, author));

    const connection: IBlogPostCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<BlogPostModel> =>
        ctx.services.blogPostPolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };
    return connection;
  }
}