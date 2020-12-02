import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { GqlNever, IGqlNever } from "../../../common/gql/gql.ever";
import { ActionsGqlNode, IActionsGqlNodeSource } from "../../actions/actions.gql.node";

export type ILogoutGqlNodeSource = IGqlNever;
export const LogoutGqlNode = new GraphQLObjectType<ILogoutGqlNodeSource, GqlContext>({
  name: 'LogoutNode',
  fields: () => ({
    can: { type: GraphQLNonNull(ActionsGqlNode), resolve: (): IActionsGqlNodeSource => GqlNever },
  }),
})