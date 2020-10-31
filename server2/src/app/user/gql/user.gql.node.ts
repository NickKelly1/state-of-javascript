import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UserModel } from "../../../circle";
import { IUserGqlActionsSource, UserGqlActions } from "./user.gql.actions";
import { IUserGqlRelationsSource, UserGqlRelations } from "./user.gql.relations";
import { IUserGqlDataSource, UserGqlData } from "./user.gql.data";
import { GqlContext } from "../../../common/context/gql.context";

export type IUserGqlNodeSource = UserModel;
export const UserGqlNode: GraphQLObjectType<IUserGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'UserNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `user_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(UserGqlData),
      resolve: (parent): IUserGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(UserGqlActions),
      resolve: (parent): IUserGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(UserGqlRelations),
      resolve: function (parent): IUserGqlRelationsSource {
        return parent;
      },
    },
  }),
});