import { RoleModel, UserRoleModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { Op } from "sequelize";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserRoleCollectionGqlNodeSource, UserRoleCollectionGqlNode } from "../../user-role/gql/user-role.collection.gql.node";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { UserRoleGqlQuery } from "../../user-role/gql/user-role.gql.query";
import { IRolePermissionCollectionGqlNodeSource, RolePermissionCollectionGqlNode } from "../../role-permission/gql/role-permission.collection.gql.node";
import { RolePermissionGqlQuery } from "../../role-permission/gql/role-permission.gql.query";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { RolePermissionModel } from "../../role-permission/role-permission.model";

export type IRoleGqlRelationsSource = RoleModel;
export const RoleGqlRelations = new GraphQLObjectType<IRoleGqlRelationsSource, GqlContext>({
  name: 'RoleRelations',
  fields: () => ({
    userRoles: {
      type: GraphQLNonNull(UserRoleCollectionGqlNode),
      args: gqlQueryArg(UserRoleGqlQuery),
      resolve: async (parent, args, ctx): Promise<IUserRoleCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRoleRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [UserRoleField.user_id]: { [Op.eq]: parent.id } }
            ]),
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: IUserRoleCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<UserRoleModel> =>
            ctx.services.userRolePolicy().canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },


    rolePermissions: {
      type: GraphQLNonNull(RolePermissionCollectionGqlNode),
      args: gqlQueryArg(RolePermissionGqlQuery),
      resolve: async (parent, args, ctx): Promise<IRolePermissionCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.rolePermissionRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [RolePermissionField.role_id]: { [Op.eq]: parent.id } },
            ]),
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<RolePermissionModel> =>
            ctx.services.rolePermissionPolicy().canFindOne({ model })
              ? model
              : null
          ),
          pagination,
        };
        return connection;
      },
    },

  }),
});