import { Includeable, ModelCtor, Order, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrArray } from "../../common/types/or-array.type";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { QueryRunner } from "../db/query-runner";
import { INpmsPackageCollectionGqlNodeSource } from "./gql/npms-package.collection.gql.node";
import { NpmsPackageField } from "./npms-package.attributes";
import { NpmsPackageLang } from "./npms-package.lang";
import { NpmsPackageModel } from "./npms-package.model";

export class NpmsPackageRepository extends BaseRepository<NpmsPackageModel> {
  protected readonly Model = NpmsPackageModel as ModelCtor<NpmsPackageModel>;

  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return NpmsPackageLang.NotFound;
  }

  /**
   * @inheritdoc
   */
  order(): OrUndefined<Order> {
    return [
      [NpmsPackageField.name, 'ASC'],
    ];
  }

  /**
   * Find a GraphQL Collection of UserRole
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<NpmsPackageModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>;
  }): Promise<INpmsPackageCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include } = arg;
    const { queryOptions, page } = this.transformGqlCollectionQuery({ args });
    const { rows, count } = await this.findAllAndCount({
      runner,
      options: {
        ...queryOptions,
        where: andWhere([ where, queryOptions.where, ]),
        include: concatIncludables([ include, queryOptions.include, ]),
      },
    });
    const pagination = collectionMeta({ data: rows, total: count, page });
    const collection: INpmsPackageCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<NpmsPackageModel> =>
        ctx.services.npmsPackagePolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };
    return collection;
  }
}
