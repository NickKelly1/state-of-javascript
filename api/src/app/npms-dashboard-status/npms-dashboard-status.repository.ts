import { Includeable, ModelCtor, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrArray } from "../../common/types/or-array.type";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { QueryRunner } from "../db/query-runner";
import { INpmsDashboardStatusCollectionGqlNodeSource } from "./gql/npms-dashboard-status.collection.gql.node";
import { NpmsDashboardStatusModel } from "./npms-dashboard-status.model";
import { NpmsDashboardStatusLang } from './npms-dashboard-status.lang';
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";


export class NpmsDashboardStatusRepository extends BaseRepository<NpmsDashboardStatusModel> {
  protected readonly Model = NpmsDashboardStatusModel as ModelCtor<NpmsDashboardStatusModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return NpmsDashboardStatusLang.NotFound;
  }


  /**
   * Find a GraphQL Collection of NpmsDashboardStatuses
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<NpmsDashboardStatusModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<INpmsDashboardStatusCollectionGqlNodeSource> {
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
    const collection: INpmsDashboardStatusCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<NpmsDashboardStatusModel> =>
        ctx.services.npmsDashboardStatusPolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };

    return collection;
  }
}