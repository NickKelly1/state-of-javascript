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
import { BlogPostCommentAssociation } from "./blog-post-comment.associations";
import { BlogPostCommentLang } from "./blog-post-comment.lang";
import { BlogPostCommentModel } from "./blog-post-comment.model";
import { IBlogPostCommentCollectionGqlNodeSource } from "./gql/blog-post-comment.collection.gql.node";


export class BlogPostCommentRepository extends BaseRepository<BlogPostCommentModel> {
  protected readonly Model = BlogPostCommentModel as ModelCtor<BlogPostCommentModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return BlogPostCommentLang.NotFound;
  }


  /**
   * Find a GraphQL Collection of BlogPostComment
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where: OrNull<WhereOptions<BlogPostCommentModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<IBlogPostCommentCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include, } = arg;
    const { page, queryOptions } = this.transformGqlCollectionQuery({ args, });
    const { rows, count } = await this.findAllAndCount({
      runner,
      options: {
        ...queryOptions,
        where: andWhere([where, queryOptions.where]),
        include: concatIncludables([
          include,
          queryOptions.include,
          [
            { association: BlogPostCommentAssociation.post, },
            { association: BlogPostCommentAssociation.author, },
          ],
        ]),
      },
    });
    const pagination = collectionMeta({ data: rows, total: count, page });

    // prime blogPost...
    rows
      .map(row => assertDefined(row.post))
      .forEach(post => ctx.loader.blogPosts.prime(post.id, post));

    // prime authors...
    rows
      .map(row => assertDefined(row.author))
      .forEach(author => ctx.loader.users.prime(author.id, author));

    const collection: IBlogPostCommentCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<BlogPostCommentModel> =>
        ctx.services.blogPostCommentPolicy.canFindOne({
          model,
          post: assertDefined(model.post),
        })
          ? model
          : null
        ),
      pagination,
    };
    return collection;
  }
}
