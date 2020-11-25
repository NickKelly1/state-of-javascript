import { GraphQLObjectType, GraphQLNonNull } from "graphql";
import { IAccessToken } from "../token/access.token.gql";
import { AccessTokenGqlData, IAccessTokenGqlDataSource } from "./access-token.gql.data";
import { AccessTokenGqlRelations, IAccessTokenGqlRelationsSource } from "./access-token.gql.relations";

export type IAccessTokenGqlNodeSource = IAccessToken;
export const AccessTokenGqlNode = new GraphQLObjectType({
  name: 'AccessTokenNode',
  fields: () => ({
    data: {
      type: GraphQLNonNull(AccessTokenGqlData),
      resolve: (parent, args, ctx): IAccessTokenGqlDataSource => parent,
    },
    relations: {
      type: AccessTokenGqlRelations,
      resolve: (parent, args, ctx): IAccessTokenGqlRelationsSource => parent,
    },
  }),
});