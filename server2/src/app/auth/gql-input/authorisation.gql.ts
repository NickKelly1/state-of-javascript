import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IAccessTokenGqlNodeSource, AccessTokenGqlNode } from "../gql/access-token.gql.node";
import { IRefreshTokenGqlNodeSource, RefreshTokenGqlNode } from "../gql/refresh-token.gql.node";

// ----------------
// ---- output ----
// ----------------

export interface IAuthorisationRo {
  access_token: string;
  refresh_token: string;
  access_token_object: IAccessTokenGqlNodeSource;
  refresh_token_object: IRefreshTokenGqlNodeSource;
  user_name: string;
}


export type IAuthorisationGqlNodeSource = IAuthorisationRo;
export const AuthorisationGqlNode = new GraphQLObjectType<IAuthorisationGqlNodeSource, GqlContext>({
  name: 'AuthorisationGqlNode',
  fields: () => ({
    access_token: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent.access_token },
    refresh_token: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent.refresh_token },
    access_token_object: { type: GraphQLNonNull(AccessTokenGqlNode), resolve: (parent): IAccessTokenGqlNodeSource => parent.access_token_object },
    refresh_token_object: { type: GraphQLNonNull(RefreshTokenGqlNode), resolve: (parent): IRefreshTokenGqlNodeSource => parent.refresh_token_object },
  }),
});