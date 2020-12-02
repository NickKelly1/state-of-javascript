import { GraphQLIncludeDirective, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { GqlNever } from "../../../common/gql/gql.ever";
import { OrNull } from "../../../common/types/or-null.type";
import { ActionsGqlNode, IActionsGqlNodeSource } from "../../actions/actions.gql.node";
import { IAccessTokenGqlNodeSource, AccessTokenGqlNode } from "../gql/access-token.gql.node";
import { IRefreshTokenGqlNodeSource, RefreshTokenGqlNode } from "../gql/refresh-token.gql.node";
import { IAuthenticationGqlNodeSource } from "./authorisation.gql";

// ----------------
// ---- output ----
// ----------------

export type IMeGqlNodeSource = OrNull<IAuthenticationGqlNodeSource>
export const MeGqlNode = new GraphQLObjectType<IMeGqlNodeSource, GqlContext>({
  name: 'MeNode',
  fields: () => ({
    can: { type: GraphQLNonNull(ActionsGqlNode), resolve: (parent): IActionsGqlNodeSource => GqlNever, },
    authentication: { type: ActionsGqlNode, resolve: (parent): OrNull<IAuthenticationGqlNodeSource> => parent, },
  }),
});