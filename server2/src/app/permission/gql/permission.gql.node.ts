import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Op } from "sequelize";
import { PermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { transformGqlCollectionInput } from "../../../common/gql/gql.collection.transform";
import { connectionGqlArg } from "../../../common/gql/gql.connection.input";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { IRolePermissionGqlConnection, RolePermissionGqlConnection } from "../../role-permission/gql/role-permission.gql.connection";
import { IRolePermissionGqlEdge } from "../../role-permission/gql/role-permission.gql.edge";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";

export type IPermissionGqlNode = PermissionModel;
export const PermissionGqlNode = new GraphQLObjectType<IPermissionGqlNode, GqlContext>({
  name: 'Permission',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },

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
              [RolePermissionField.permission_id]: { [Op.eq]: parent.id }
            },
          }
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
