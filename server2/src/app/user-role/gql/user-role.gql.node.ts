import { GraphQLNonNull, GraphQLObjectType, GraphQLString  } from "graphql";
import { IUserRoleGqlDataSource, UserRoleGqlData } from "./user-role.gql.data";
import { UserRoleModel } from "../../../circle";
import { IUserRoleGqlActionsSource, UserRoleGqlActions } from "./user-role.gql.actions";
import { IUserRoleGqlRelationsSource, UserRoleGqlRelations } from "./user-role.gql.relations";
import { GqlContext } from "../../../common/context/gql.context";

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