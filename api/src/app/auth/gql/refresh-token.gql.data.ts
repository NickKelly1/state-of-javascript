import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLFloat } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IRefreshToken } from "../token/refresh.token.gql";


export type IRefreshTokenGqlDataSource = IRefreshToken;
export const RefreshTokenGqlData = new GraphQLObjectType<IRefreshTokenGqlDataSource, GqlContext>({
  name: 'RefreshTokenData',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt), resolve: (parent) => parent.user_id, },
    iat: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent) => parent.iat, },
    exp: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent) => parent.exp, },
  }),
});