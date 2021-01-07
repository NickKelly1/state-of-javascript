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
import { ImageAssociation } from "./image.associations";
import { ImageLang } from "./image.lang";
import { ImageModel } from "./image.model";
// import { IImageCollectionGqlNodeSource } from "./gql/image.collection.gql.node";


export class ImageRepository extends BaseRepository<ImageModel> {
  protected readonly Model = ImageModel as ModelCtor<ImageModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return ImageLang.NotFound;
  }


  // /**
  //  * Find a GraphQL Collection of Image
  //  */
  // async gqlCollection(arg: {
  //   runner: OrNull<QueryRunner>;
  //   args: IGqlArgs;
  //   where: OrNull<WhereOptions<ImageModel['_attributes']>>,
  //   include?: OrNullable<OrArray<Includeable>>,
  // }): Promise<IImageCollectionGqlNodeSource> {
  //   const { ctx } = this;
  //   const { runner, args, where, include, } = arg;
  //   const { page, queryOptions } = this.transformGqlCollectionQuery({ args, });
  //   const { rows, count } = await this.findAllAndCount({
  //     runner,
  //     options: {
  //       ...queryOptions,
  //       where: andWhere([where, queryOptions.where]),
  //       include: concatIncludables([
  //         include,
  //         queryOptions.include,
  //         [
  //           { association: ImageAssociation.uploader, },
  //         ],
  //       ]),
  //     },
  //   });
  //   const pagination = collectionMeta({ data: rows, total: count, page });

  //   // prime uploader...
  //   rows
  //     .map(row => assertDefined(row.uploader))
  //     .forEach(author => ctx.loader.users.prime(author.id, author));

  //   const collection: IImageCollectionGqlNodeSource = {
  //     models: rows.map((model): OrNull<ImageModel> => model),
  //       // ctx.services.imagePolicy.canFindOne({
  //       //   model,
  //       //   post: assertDefined(model.post),
  //       // })
  //       //   ? model
  //       //   : null
  //       // ),
  //     pagination,
  //   };
  //   return collection;
  // }
}
