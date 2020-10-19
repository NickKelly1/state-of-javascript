import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { UserRoleModel } from "../user-role.model";
import { UserField } from "../../user/user.attributes";
import { UserModel } from "../../../circle";
import { IUserGqlConnection, UserGqlConnection } from "../../user/gql/user.gql.connection";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { IUserGqlEdge } from "../../user/gql/user.gql.edge";
import { GqlContext } from "../../../common/classes/gql.context";
import { IRoleGqlConnection, RoleGqlConnection } from "../../role/gql/role.gql.connection";
import { RoleModel } from "../../role/role.model";
import { RoleField } from "../../role/role.attributes";
import { IRoleGqlEdge } from "../../role/gql/role.gql.edge";
import { connectionGqlArg } from "../../../common/gql/gql.connection.input";
import { transformGqlCollectionInput } from "../../../common/gql/gql.collection.transform";


export type IUserRoleGqlNode = UserRoleModel;
export const UserRoleGqlNode: GraphQLObjectType<IUserRoleGqlNode, GqlContext> = new GraphQLObjectType<IUserRoleGqlNode, GqlContext>({
  name: 'UserRole',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    user_id: { type: GraphQLNonNull(GraphQLInt), },
    role_id: { type: GraphQLNonNull(GraphQLInt), },

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

    userConnection: {
      type: GraphQLNonNull(UserGqlConnection),
      args: connectionGqlArg,
      resolve: async (parent, args) => {
        const { page, findOpts } = transformGqlCollectionInput(args);
        const { rows, count } = await UserModel.findAndCountAll({
          ...findOpts,
          where: {
            [UserField.id]: { [Op.eq]: parent.user_id },
          },
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IUserGqlConnection = {
          edges: rows.map((row): IUserGqlEdge => ({
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
