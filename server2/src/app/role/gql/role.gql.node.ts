import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Op, } from "sequelize";
import { GqlContext } from "../../../common/classes/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IRolePermissionGqlConnection, RolePermissionGqlConnection } from "../../role-permission/gql/role-permission.gql.connection";
import { IRolePermissionGqlEdge } from "../../role-permission/gql/role-permission.gql.edge";
import { GqlRolePermissionQuery } from "../../role-permission/gql/role-permission.gql.query";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { IUserRoleGqlConnection, UserRoleGqlConnection } from "../../user-role/gql/user-role.gql.connection";
import { IUserRoleGqlEdge } from "../../user-role/gql/user-role.gql.edge";
import { GqlUserRoleQuery } from "../../user-role/gql/user-role.gql.query";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { RoleModel } from "../role.model";


export type IRoleGqlNode = RoleModel;
export const RoleGqlNode = new GraphQLObjectType<IRoleGqlNode, GqlContext>({
  name: 'Role',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
    ...SoftDeleteableGql,

    userRoleConnection: {
      type: GraphQLNonNull(UserRoleGqlConnection),
      args: gqlQueryArg(GqlUserRoleQuery),
      resolve: async (parent, args, ctx): Promise<IUserRoleGqlConnection> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRoleRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [UserRoleField.role_id]: { [Op.eq]: parent.id } },
            ]),
          }
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IUserRoleGqlConnection = {
          edges: rows.map((model): OrNull<IUserRoleGqlEdge> =>
            ctx.services.userRolePolicy().canFindOne({ model })
              ? ({ cursor: model.id.toString(), node: model, })
              : null
          ),
          meta,
        };
        return connection;
      },
    },

    rolePermissionConnection: {
      type: GraphQLNonNull(RolePermissionGqlConnection),
      args: gqlQueryArg(GqlRolePermissionQuery),
      resolve: async (parent, args, ctx): Promise<IRolePermissionGqlConnection> => {
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
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionGqlConnection = {
          edges: rows.map((model): OrNull<IRolePermissionGqlEdge> =>
            ctx.services.rolePermissionPolicy().canFindOne({ model })
              ? ({ cursor: model.id.toString(), node: model, })
              : null
          ),
          meta,
        };
        return connection;
      },
    },
  }),
});
