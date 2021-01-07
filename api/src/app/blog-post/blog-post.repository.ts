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
import { ImageAssociation } from "../image/image.associations";
import { FileAssociation } from "../file/file.associations";


export class BlogPostRepository extends BaseRepository<BlogPostModel> {
  protected readonly Model = BlogPostModel as ModelCtor<BlogPostModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return BlogPostLang.NotFound;
  }


  /**
   * Default joins for priming
   */
  protected _includes(): Includeable[]  {
    return [
      { association: BlogPostAssociation.status, },
      { association: BlogPostAssociation.author, },
      {
        association: BlogPostAssociation.image,
        include: [
          {
            association: ImageAssociation.display,
            include: [
              { association: FileAssociation.uploader, }
            ],
          },
          {
            association: ImageAssociation.original,
            include: [
              { association: FileAssociation.uploader, }
            ],
          },
          {
            association: ImageAssociation.thumbnail,
            include: [
              { association: FileAssociation.uploader, }
            ],
          },
        ],
      },
    ];
  }


  /**
   * Default primes
   */
  protected _prime(arg: {
    model: BlogPostModel,
  }): void {
    const { ctx } = this;
    const { model } = arg;
    // prime statuses...
    const status = assertDefined(model.status);
    this.ctx.loader.blogPostStatus.prime(status.id, status);

    // prime authors...
    const author = assertDefined(model.author);
    ctx.loader.users.prime(author.id, author);

    // prime images
    const image = model.image;
    if (model.image_id) { ctx.loader.images.prime(model.image_id, image ?? null); }
    if (image) {
      if (image.original) {
        // prime original
        ctx.loader.files.prime(image.original.id, image.original);
        if (image.original.uploader) {
          // prime original uploader
          ctx.loader.users.prime(image.original.uploader.id, image.original.uploader);
        }
      }

      if (image.thumbnail) {
        // prime thumbnails
        ctx.loader.files.prime(image.thumbnail.id, image.thumbnail);
        if (image.thumbnail.uploader) {
          // prime thumbnail uploader
          ctx.loader.users.prime(image.thumbnail.uploader.id, image.thumbnail.uploader);
        }
      }

      if (image.display) {
        // prime displays
        ctx.loader.files.prime(image.display.id, image.display);
        if (image.display.uploader) {
          // prime display uploader
          ctx.loader.users.prime(image.display.uploader.id, image.display.uploader);
        }
      }
    }
  }

  /**
   * Get a fresh, deeply hydrated model & primed model
   */
  async fresh(arg: { 
    model: BlogPostModel
  }): Promise<OrNull<BlogPostModel>> {
    const { model } = arg;
    const reprimed = await this.findByPk(
      model.id,
      {
        runner: null,
        unscoped: true,
        options: {
          include: this._includes(),
        },
      },
    );

    if (!reprimed) return null;
    this._prime({ model: reprimed });
    return reprimed;
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
          this._includes(),
        ]),
      },
    });
    const pagination = collectionMeta({ data: rows, total: count, page });

    rows.forEach(row => this._prime({ model: row }));

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