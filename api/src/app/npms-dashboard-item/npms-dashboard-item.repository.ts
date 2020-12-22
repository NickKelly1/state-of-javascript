import { Includeable, ModelCtor, Order, WhereOptions } from "sequelize";
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
import { OrUndefined } from "../../common/types/or-undefined.type";
import { QueryRunner } from "../db/query-runner";
import { NpmsDashboardLang } from "../npms-dashboard/npms-dashboard.lang";
import { INpmsDashboardItemCollectionGqlNodeSource } from "./gql/npms-dashboard-item.collection.gql.node";
import { NpmsDashboardItemAssociation } from "./npms-dashboard-item.associations";
import { NpmsDashboardItemField } from "./npms-dashboard-item.attributes";
import { NpmsDashboardItemLang } from "./npms-dashboard-item.lang";
import { NpmsDashboardItemModel } from "./npms-dashboard-item.model";

export class NpmsDashboardItemRepository extends BaseRepository<NpmsDashboardItemModel> {
  /**
   * @inheritdoc
   */
  protected readonly Model = NpmsDashboardItemModel as ModelCtor<NpmsDashboardItemModel>;

  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return NpmsDashboardItemLang.NotFound;
  }


  order(): OrUndefined<Order> {
    return [
      [NpmsDashboardItemField.order, 'ASC'],
      [NpmsDashboardItemField.npms_package_id, 'ASC'],
      [NpmsDashboardItemField.id, 'ASC'],
    ];
  }

  /**
   * Find a GraphQL Collection of NpmsDashboardItems
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<NpmsDashboardItemModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<INpmsDashboardItemCollectionGqlNodeSource> {
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
          [
            { association: NpmsDashboardItemAssociation.dashboard },
            { association: NpmsDashboardItemAssociation.npmsPackage },
          ],
        ]),
      },
    });
    const pagination = collectionMeta({ data: rows, total: count, page });

    // prime dashboards....
    rows
      .map(row => assertDefined(row.dashboard))
      .forEach(dashboard => ctx.loader.npmsDashboard.prime(dashboard.id, assertDefined(dashboard)));

    const collection: INpmsDashboardItemCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<NpmsDashboardItemModel> =>
        ctx.services.npmsDashboardItemPolicy.canFindOne({
          model,
          dashboard: assertDefined(model.dashboard),
          npmsPackage: assertDefined(model.npmsPackage),
        })
          ? model
          : null
        ),
      pagination,
    };
    return collection;
  }
}
