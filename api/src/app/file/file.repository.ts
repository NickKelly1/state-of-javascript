import { ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { FileLang } from "./file.lang";
import { FileModel } from "./file.model";
// import { IFileCollectionGqlNodeSource } from "./gql/file.collection.gql.node";


export class FileRepository extends BaseRepository<FileModel> {
  protected readonly Model = FileModel as ModelCtor<FileModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return FileLang.NotFound;
  }


  // /**
  //  * Find a GraphQL Collection of File
  //  */
  // async gqlCollection(arg: {
  //   runner: OrNull<QueryRunner>;
  //   args: IGqlArgs;
  //   where: OrNull<WhereOptions<FileModel['_attributes']>>,
  //   include?: OrNullable<OrArray<Includeable>>,
  // }): Promise<IFileCollectionGqlNodeSource> {
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
  //           { association: FileAssociation.uploader, },
  //         ],
  //       ]),
  //     },
  //   });
  //   const pagination = collectionMeta({ data: rows, total: count, page });

  //   // prime uploader...
  //   rows
  //     .map(row => assertDefined(row.uploader))
  //     .forEach(author => ctx.loader.users.prime(author.id, author));

  //   const collection: IFileCollectionGqlNodeSource = {
  //     models: rows.map((model): OrNull<FileModel> => model),
  //       // ctx.services.filePolicy.canFindOne({
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
