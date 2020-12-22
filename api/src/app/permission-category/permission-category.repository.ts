import { Includeable, ModelCtor, WhereOptions } from "sequelize";
import { PermissionCategoryModel } from "../../circle";
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
import { IPermissionCategoryCollectionGqlNodeSource } from "./gql/permission-category.collection.gql.node";
import { PermissionCategoryLang } from "./permission-category.lang";



export class PermissionCategoryRepository extends BaseRepository<PermissionCategoryModel> {
  protected readonly Model = PermissionCategoryModel as ModelCtor<PermissionCategoryModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return PermissionCategoryLang.NotFound;
  }


  /**
   * Find a GraphQL Collection of PermissionCategories
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<PermissionCategoryModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<IPermissionCategoryCollectionGqlNodeSource> {
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
    const collection: IPermissionCategoryCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<PermissionCategoryModel> =>
        ctx.services.permissionCategoryPolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };

    return collection;
  }
}