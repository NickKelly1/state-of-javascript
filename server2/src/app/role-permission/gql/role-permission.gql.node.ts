import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Op } from "sequelize";
import { UserField } from "../../user/user.attributes";
import { UserModel } from "../../../circle";
import { RolePermissionGqlConnection } from "./role-permission.gql.connection";
import { IUserGqlConnection, UserGqlConnection } from "../../user/gql/user.gql.connection";
import { IPaginateInput } from "../../../common/interfaces/pageinate-input.interface";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { GqlContext } from "../../../common/classes/gql.context";
import { RolePermissionModel } from "../role-permission.model";
import { RoleModel } from "../../role/role.model";
import { IRoleGqlConnection, RoleGqlConnection } from "../../role/gql/role.gql.connection";
import { RoleField } from "../../role/role.attributes";
import { IRoleGqlEdge } from "../../role/gql/role.gql.edge";
import { connectionGqlArg } from "../../../common/gql/gql.connection.input";
import { transformGqlCollectionInput } from "../../../common/gql/gql.collection.transform";
import { IPermissionGqlConnection, PermissionGqlConnection } from "../../permission/gql/permission.gql.connection";
import { PermissionModel } from "../../permission/permission.model";
import { IPermissionGqlEdge } from "../../permission/gql/permission.gql.edge";
import { PermissionField } from "../../permission/permission.attributes";


export type IRolePermissionGqlNode = RolePermissionModel;
export const RolePermissionGqlNode: GraphQLObjectType<RolePermissionModel, GqlContext> = new GraphQLObjectType<RolePermissionModel, GqlContext>({
  name: 'RolePermission',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    role_id: { type: GraphQLNonNull(GraphQLInt), },
    permission_id: { type: GraphQLNonNull(GraphQLInt), },

    roleConnection: {
      type: GraphQLNonNull(RoleGqlConnection),
      args: connectionGqlArg,
      resolve: async (parent, args): Promise<IRoleGqlConnection> => {
        const { page, findOpts } = transformGqlCollectionInput(args);
        const { rows, count } = await RoleModel.findAndCountAll({
          ...findOpts,
          where: {
            [RoleField.id]: { [Op.eq]: parent.role_id },
          },
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IRoleGqlConnection = {
          edges: rows.map((row): IRoleGqlEdge => ({
            cursor: row.id.toString(),
            node: row,
          })),
          meta,
        };
        return connection;
      },
    },

    permissionConnection: {
      type: GraphQLNonNull(PermissionGqlConnection),
      args: connectionGqlArg,
      resolve: async (parent, args): Promise<IPermissionGqlConnection> => {
        const { page, findOpts } = transformGqlCollectionInput(args);
        const { rows, count } = await PermissionModel.findAndCountAll({
          ...findOpts,
          where: {
            [PermissionField.id]: { [Op.eq]: parent.permission_id },
          },
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IPermissionGqlConnection = {
          edges: rows.map((row): IPermissionGqlEdge => ({
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
