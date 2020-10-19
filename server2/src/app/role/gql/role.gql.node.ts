import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Op, } from "sequelize";
import { GqlContext } from "../../../common/classes/gql.context";
import { transformGqlCollectionInput } from "../../../common/gql/gql.collection.transform";
import { connectionGqlArg } from "../../../common/gql/gql.connection.input";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { IRolePermissionGqlConnection, RolePermissionGqlConnection } from "../../role-permission/gql/role-permission.gql.connection";
import { IRolePermissionGqlEdge } from "../../role-permission/gql/role-permission.gql.edge";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { IUserRoleGqlConnection, UserRoleGqlConnection } from "../../user-role/gql/user-role.gql.connection";
import { IUserRoleGqlEdge } from "../../user-role/gql/user-role.gql.edge";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { RoleModel } from "../role.model";


export type IRoleGqlNode = RoleModel;
export const RoleGqlNode = new GraphQLObjectType<IRoleGqlNode, GqlContext>({
  name: 'Role',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },

    userRoleConnection: {
      type: GraphQLNonNull(UserRoleGqlConnection),
      args: connectionGqlArg,
      resolve: async (parent, args, ctx): Promise<IUserRoleGqlConnection> => {
        const { page, options } = transformGqlCollectionInput(args);
        const { rows, count } = await ctx.services.userRoleRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: {
              [UserRoleField.role_id]: { [Op.eq]: parent.id }
            },
          }
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IUserRoleGqlConnection = {
          edges: rows.map((row): IUserRoleGqlEdge => ({
            cursor: row.id.toString(),
            node: row,
          })),
          meta,
        };
        return connection;
      },
    },

    rolePermissionConnection: {
      type: GraphQLNonNull(RolePermissionGqlConnection),
      args: connectionGqlArg,
      resolve: async (parent, args, ctx): Promise<IRolePermissionGqlConnection> => {
        const { page, options } = transformGqlCollectionInput(args);
        const { rows, count } = await ctx.services.rolePermissionRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: {
              [RolePermissionField.role_id]: { [Op.eq]: parent.id }
            },
          },
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionGqlConnection = {
          edges: rows.map((row): IRolePermissionGqlEdge => ({
            cursor: row.id.toString(),
            node: row,
          })),
          meta,
        };
        return connection;
      },
    },
  }),
});
