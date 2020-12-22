import { FindOptions, Includeable, ModelCtor, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { QueryRunner } from "../db/query-runner";
import { IPermissionCollectionGqlNodeSource } from "./gql/permission.collection.gql.node";
import { PermissionAssociation } from "./permission.associations";
import { PermissionLang } from "./permission.lang";
import { PermissionModel } from "./permission.model";
import { OrArray } from '../../common/types/or-array.type';



export class PermissionRepository extends BaseRepository<PermissionModel> {
  protected readonly Model = PermissionModel as ModelCtor<PermissionModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return PermissionLang.NotFound;
  }


  /**
   * Find a GraphQL Collection of Permissions
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<PermissionModel['_attributes']>>;
    include?: OrNullable<OrArray<Includeable>>;
  }): Promise<IPermissionCollectionGqlNodeSource> {
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
          queryOptions.include,
          [{ association: PermissionAssociation.category },],
        ]),
      },
    });

    // eager load categories...
    rows
      .map(row => assertDefined(row.category))
      .forEach(category => ctx.loader.permissionCategories.prime(category.id, category))

    const pagination = collectionMeta({ data: rows, total: count, page });
    const collection: IPermissionCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<PermissionModel> =>
        ctx.services.permissionPolicy.canFindOne({ model })
          ? model
          : null
      ),
      pagination,
    };

    return collection;
  }
}