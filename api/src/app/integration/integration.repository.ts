import { Includeable, ModelCtor, WhereOptions } from "sequelize";
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
import { IIntegrationCollectionGqlNodeSource } from "./gql/integration.collection.gql.node";
import { IntegrationLang } from "./integration.lang";
import { IntegrationModel } from "./integration.model";



export class IntegrationRepository extends BaseRepository<IntegrationModel> {
  protected readonly Model = IntegrationModel as ModelCtor<IntegrationModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return IntegrationLang.NotFound;
  }



  /**
   * Find a GraphQL Collection of an Integration
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<IntegrationModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<IIntegrationCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include, } = arg;
    const { page, queryOptions } = this.transformGqlCollectionQuery({ args, });
    const { rows, count } = await ctx.services.integrationRepository.findAllAndCount({
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
    const connection: IIntegrationCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<IntegrationModel> =>
        ctx.services.integrationPolicy.canFindOne({ model })
          ? model
          : null
      ),
      pagination,
    };
    return connection;
  }
}
