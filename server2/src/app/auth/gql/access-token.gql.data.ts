import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString, GraphQLFloat } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IAccessToken } from "../token/access.token.gql";


export type IAccessTokenGqlDataSource = IAccessToken;
export const AccessTokenGqlData = new GraphQLObjectType<IAccessTokenGqlDataSource, GqlContext>({
  name: 'AccessTokenData',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt), resolve: (parent): number => parent.user_id, },
    permissions: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLInt))), resolve: (parent) => parent.permissions, },
    iat: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent.iat, },
    exp: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent.exp, },
  }),
});