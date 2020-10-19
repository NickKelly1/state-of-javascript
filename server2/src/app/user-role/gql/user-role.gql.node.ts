import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { UserRoleModel } from "../user-role.model";
import { UserField } from "../../user/user.attributes";
import { UserModel } from "../../../circle";
import { IUserGqlConnection, UserGqlConnection } from "../../user/gql/user.gql.connection";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { IUserGqlEdge, UserGqlEdge } from "../../user/gql/user.gql.edge";
import { GqlContext } from "../../../common/classes/gql.context";
import { IRoleGqlConnection, RoleGqlConnection } from "../../role/gql/role.gql.connection";
import { RoleModel } from "../../role/role.model";
import { RoleField } from "../../role/role.attributes";
import { IRoleGqlEdge, RoleGqlEdge } from "../../role/gql/role.gql.edge";
import { connectionGqlArg } from "../../../common/gql/gql.connection.input";
import { transformGqlCollectionInput } from "../../../common/gql/gql.collection.transform";


export type IUserRoleGqlNode = UserRoleModel;
export const UserRoleGqlNode: GraphQLObjectType<IUserRoleGqlNode, GqlContext> = new GraphQLObjectType<IUserRoleGqlNode, GqlContext>({
  name: 'UserRole',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    user_id: { type: GraphQLNonNull(GraphQLInt), },
    role_id: { type: GraphQLNonNull(GraphQLInt), },

    user: {
      type: GraphQLNonNull(UserGqlEdge),
      resolve: async (parent, args, ctx): Promise<IUserGqlEdge> => {
        const model = await ctx.loader.users.load(parent.user_id);
        const edge: IUserGqlEdge = { node: model, cursor: model.id.toString(), };
        return edge;
      },
    },

    role: {
      type: GraphQLNonNull(RoleGqlEdge),
      resolve: async (parent, args, ctx): Promise<IRoleGqlEdge> => {
        const model = await ctx.loader.roles.load(parent.role_id);
        const edge: IRoleGqlEdge = { node: model, cursor: model.id.toString(), };
        return edge;
      },
    },
  }),
});
