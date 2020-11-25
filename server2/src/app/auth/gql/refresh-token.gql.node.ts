
import { GraphQLObjectType, GraphQLNonNull } from "graphql";
import { IAccessToken } from "../token/access.token.gql";
import { IRefreshToken } from "../token/refresh.token.gql";
import { AccessTokenGqlData, IAccessTokenGqlDataSource } from "./access-token.gql.data";
import { AccessTokenGqlRelations, IAccessTokenGqlRelationsSource } from "./access-token.gql.relations";
import { RefreshTokenGqlData, IRefreshTokenGqlDataSource } from "./refresh-token.gql.data";
import { RefreshTokenGqlRelations, IRefreshTokenGqlRelationsSource } from "./refresh-token.gql.relations";

export type IRefreshTokenGqlNodeSource = IRefreshToken;
export const RefreshTokenGqlNode = new GraphQLObjectType({
  name: 'RefreshTokenNode',
  fields: () => ({
    data: {
      type: GraphQLNonNull(RefreshTokenGqlData),
      resolve: (parent, args, ctx): IRefreshTokenGqlDataSource => parent,
    },
    relations: {
      type: RefreshTokenGqlRelations,
      resolve: (parent, args, ctx): IRefreshTokenGqlRelationsSource => parent,
    },
  }),
});