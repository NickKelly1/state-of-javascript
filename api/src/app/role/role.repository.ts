import { Includeable, ModelCtor, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { QueryRunner } from "../db/query-runner";
import { IRoleCollectionGqlNodeSource } from "./gql/role.collection.gql.node";
import { RoleModel } from "./role.model";
import { OrArray } from '../../common/types/or-array.type';
import { RoleLang } from './role.lang';



export class RoleRepository extends BaseRepository<RoleModel> {
  protected readonly Model = RoleModel as ModelCtor<RoleModel>;

  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return RoleLang.NotFound;
  }

  /**
   * Find a GraphQL Collection of Roles
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<RoleModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>;
  }): Promise<IRoleCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include, } = arg;
    const { page, queryOptions } = this.transformGqlCollectionQuery({ args });
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
    const connection: IRoleCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<RoleModel> =>
        ctx.services.rolePolicy.canFindOne({ model })
          ? model
          : null
      ),
      pagination,
    };
    return connection;
  }
}