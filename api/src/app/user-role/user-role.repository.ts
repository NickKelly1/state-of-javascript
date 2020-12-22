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
import { RolePermissionLang } from "../role-permission/role-permission.lang";
import { IUserRoleCollectionGqlNodeSource } from "./gql/user-role.collection.gql.node";
import { UserRoleAssociation } from "./user-role.associations";
import { UserRoleModel } from "./user-role.model";
import { OrArray } from '../../common/types/or-array.type';



export class UserRoleRepository extends BaseRepository<UserRoleModel> {
  protected readonly Model = UserRoleModel as ModelCtor<UserRoleModel>;

  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return RolePermissionLang.NotFound;
  }

  /**
   * Find a GraphQL Collection of UserRole
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<UserRoleModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>;
  }): Promise<IUserRoleCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include } = arg;
    const { queryOptions, page } = this.transformGqlCollectionQuery({ args });
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
          [
            { association: UserRoleAssociation.user, },
            { association: UserRoleAssociation.role, },
          ],
        ]),
      },
    });

    // prime users
    rows.map(row => {
      const user = assertDefined(row.user);
      ctx.loader.users.prime(user.id, user);
    });

    // prime roles
    rows.map(row => {
      const role = assertDefined(row.role);
      ctx.loader.roles.prime(role.id, role);
    });

    const pagination = collectionMeta({ data: rows, total: count, page });
    const collection: IUserRoleCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<UserRoleModel> =>
        ctx.services.userRolePolicy.canFindOne({
          model,
          user: assertDefined(model.user),
          role: assertDefined(model.role),
        })
          ? model
          : null
      ),
      pagination,
    };

    return collection;
  }
}