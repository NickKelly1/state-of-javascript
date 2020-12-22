import { Includeable, ModelCtor, WhereOptions } from "sequelize";
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
import { IRolePermissionCollectionGqlNodeSource } from "./gql/role-permission.collection.gql.node";
import { RolePermissionAssociation } from "./role-permission.associations";
import { RolePermissionLang } from "./role-permission.lang";
import { RolePermissionModel } from "./role-permission.model";
import { OrArray } from '../../common/types/or-array.type';



export class RolePermissionRepository extends BaseRepository<RolePermissionModel> {
  protected readonly Model = RolePermissionModel as ModelCtor<RolePermissionModel>;

  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return RolePermissionLang.NotFound;
  }

  /**
   * Find a GraphQL Collection of RolePermission
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<RolePermissionModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>;
  }): Promise<IRolePermissionCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include, } = arg;
    const { queryOptions, page } = this.transformGqlCollectionQuery({ args });
    const { rows, count } = await ctx.services.rolePermissionRepository.findAllAndCount({
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
          [
            { association: RolePermissionAssociation.permission, },
            { association: RolePermissionAssociation.role, },
          ],
        ]),
      },
    });

    // prime roles
    rows.map(row => {
      const role = assertDefined(row.role);
      ctx.loader.roles.prime(role.id, role);
    });

    // prime permissions
    rows.map(row => {
      const permission = assertDefined(row.permission);
      ctx.loader.permissions.prime(permission.id, permission);
    });

    const pagination = collectionMeta({ data: rows, total: count, page });
    const collection: IRolePermissionCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<RolePermissionModel> =>
        ctx.services.rolePermissionPolicy.canFindOne({
          model,
          role: assertDefined(model.role),
          permission: assertDefined(model.permission),
        })
          ? model
          : null,
      ),
      pagination,
    };

    return collection;
  }
}