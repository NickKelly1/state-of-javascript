import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../common/context/gql.context";
import { GqlNever } from "../../common/gql/gql.ever";
import { ActionsGqlNode, IActionsGqlNodeSource } from "./actions.gql.node";



export const ActionsGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  can: { type: GraphQLNonNull(ActionsGqlNode), resolve: (): IActionsGqlNodeSource => GqlNever, },
});
