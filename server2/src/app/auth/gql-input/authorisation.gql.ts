import { GraphQLIncludeDirective, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { GqlNever } from "../../../common/gql/gql.ever";
import { ActionsGqlNode, IActionsGqlNodeSource } from "../../actions/actions.gql.node";
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


export type IAuthenticationGqlNodeSource = {
  access_token: string;
  refresh_token: string;
  access_token_object: IAccessTokenGqlNodeSource;
  refresh_token_object: IRefreshTokenGqlNodeSource;
  user_name: string;
  user_id: number;
};
export const AuthenticationGqlNode = new GraphQLObjectType<IAuthenticationGqlNodeSource, GqlContext>({
  name: 'AuthenticationNode',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt), resolve: (parent): number => parent.user_id },
    user_name: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent.user_name },
    can: { type: GraphQLNonNull(ActionsGqlNode), resolve: (parent): IActionsGqlNodeSource => GqlNever, },
    access_token: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent.access_token },
    refresh_token: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent.refresh_token },
    access_token_object: { type: GraphQLNonNull(AccessTokenGqlNode), resolve: (parent): IAccessTokenGqlNodeSource => parent.access_token_object },
    refresh_token_object: { type: GraphQLNonNull(RefreshTokenGqlNode), resolve: (parent): IRefreshTokenGqlNodeSource => parent.refresh_token_object },
  }),
});