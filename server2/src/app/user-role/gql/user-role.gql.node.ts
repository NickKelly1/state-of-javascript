import { GraphQLNonNull, GraphQLObjectType, GraphQLString  } from "graphql";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IUserRoleGqlDataSource, UserRoleGqlData } from "./user-role.gql.data";
import { UserModel, UserRoleModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { IUserRoleGqlActionsSource, UserRoleGqlActions } from "./user-role.gql.actions";
import { IUserRoleGqlRelationsSource, UserRoleGqlRelations } from "./user-role.gql.relations";

export type IUserRoleGqlNodeSource = UserRoleModel;
export const UserRoleGqlNode: GraphQLObjectType<IUserRoleGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'UserRoleNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `user_role_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(UserRoleGqlData),
      resolve: (parent): IUserRoleGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(UserRoleGqlActions),
      resolve: (parent): IUserRoleGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(UserRoleGqlRelations),
      resolve: (parent): IUserRoleGqlRelationsSource => parent,
    },
  }),
});