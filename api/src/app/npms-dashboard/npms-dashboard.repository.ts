import { query } from "express";
import { Includeable, ModelCtor, Op, Order, OrderItem, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { ist } from "../../common/helpers/ist.helper";
import { orWhere } from "../../common/helpers/or-where.helper.ts";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrArray } from "../../common/types/or-array.type";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { QueryRunner } from "../db/query-runner";
import { NpmsDashboardStatus } from "../npms-dashboard-status/npms-dashboard-status.const";
import { Permission } from "../permission/permission.const";
import { INpmsDashboardCollectionGqlNodeSource } from "./gql/npms-dashboard.collection.gql.node";
import { NpmsDashboardAssociation } from "./npms-dashboard.associations";
import { NpmsDashboardField } from "./npms-dashboard.attributes";
import { NpmsDashboardLang } from "./npms-dashboard.lang";
import { NpmsDashboardModel } from "./npms-dashboard.model";

export class NpmsDashboardRepository extends BaseRepository<NpmsDashboardModel> {
  protected readonly Model = NpmsDashboardModel as ModelCtor<NpmsDashboardModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return NpmsDashboardLang.NotFound;
  }


  /**
   * @inheritdoc
   */
  order(): OrUndefined<Order> {
    return [
      [NpmsDashboardField.order, 'ASC'],
      [NpmsDashboardField.id, 'ASC'],
    ];
  }


  /**
   * @inheritdoc
   *
   * Logic equivalent to NpmsDashboardPolicy
   */
  scope(): OrUndefined<WhereOptions<NpmsDashboardModel['_attributes']>> {
    const aid = this.ctx.auth.aid;
    const user_id = this.ctx.auth.user_id;

    // let Admin, Manager and ShowAller see all
    if (this.ctx.auth.hasPermission([
      Permission.NpmsDashboards.Admin,
      // TODO: admin can see all, manager can't see deleted...
      Permission.NpmsDashboards.Manager,
    ])) {
      // Admin or Moderator: no filters...
      return undefined;
    }

    // must have Viewer|Creator
    if (!this.ctx.hasPermission(Permission.NpmsDashboards.Viewer, Permission.NpmsDashboards.Creator)) {
      return { [NpmsDashboardField.id]: { [Op.eq]: null }, };
    }

    // filter for Published or Ownership
    const where = orWhere([
      // is Published
      { [NpmsDashboardField.status_id]: { [Op.in]: [ NpmsDashboardStatus.Published, ] } },

      // or
      orWhere([

        // is Owner
        ist.defined(user_id) ? { [NpmsDashboardField.owner_id]: { [Op.eq]: user_id }, } : null,

        // or Anonymous Owner
        ist.defined(aid) ? { [NpmsDashboardField.aid]: { [Op.eq]: aid }, } : null,
      ]),
    ]);

    return where;
  }


  /**
   * Find a GraphQL Collection of NpmsDashboards
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<NpmsDashboardModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<INpmsDashboardCollectionGqlNodeSource> {
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
          [{ association: NpmsDashboardAssociation.status, },],
        ]),
      },
    });

    // prime statuses
    rows.forEach(row => {
      const status = assertDefined(row.status);
      ctx.loader.npmsDashboardStatus.prime(status.id, status);
    });

    const pagination = collectionMeta({ data: rows, total: count, page });
    const collection: INpmsDashboardCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<NpmsDashboardModel> =>
        ctx.services.npmsDashboardPolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };

    return collection;
  }
}
