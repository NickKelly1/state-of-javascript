import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Op } from "sequelize";
import { UserRoleModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { transformGqlCollectionInput } from "../../../common/gql/gql.collection.transform";
import { connectionGqlArg } from "../../../common/gql/gql.connection.input";
import { prettyQ } from "../../../common/helpers/pretty.helper";
import { IPaginateInput } from "../../../common/interfaces/pageinate-input.interface";
import { logger } from "../../../common/logger/logger";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { IUserRoleGqlConnection, UserRoleGqlConnection } from "../../user-role/gql/user-role.gql.connection";
import { IUserRoleGqlEdge } from "../../user-role/gql/user-role.gql.edge";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { UserModel } from "../user.model";

export type IUserGqlNode = UserModel;
export const UserGqlNode = new GraphQLObjectType<IUserGqlNode, GqlContext>({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },

    userRoleConnection: {
      type: GraphQLNonNull(UserRoleGqlConnection),
      args: connectionGqlArg,
      resolve: async (parent, args): Promise<IUserRoleGqlConnection> => {
        const { page, findOpts } = transformGqlCollectionInput(args);
        const { rows, count } = await UserRoleModel.findAndCountAll({
          ...findOpts,
          where: {
            [UserRoleField.user_id]: { [Op.eq]: parent.id }
          },
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
  }),
});
