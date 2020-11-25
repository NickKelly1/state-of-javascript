
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { IntegrationModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { IIntegrationGqlNodeSource, IntegrationGqlNode } from "../../integration/gql/integration.gql.node";
import { GoogleGqlActions, IGoogleGqlActionsSource } from "./google.gql.actions";

export type IGoogleGqlNodeSource = IntegrationModel;
export const GoogleGqlNode: GraphQLObjectType<IGoogleGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'GoogleNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `google_${parent.id.toString()}`,
    },
    integration: {
      type: GraphQLNonNull(IntegrationGqlNode),
      resolve: (parent): IIntegrationGqlNodeSource => parent,
    },
    can: {
      type: GraphQLNonNull(GoogleGqlActions),
      resolve: (parent): IGoogleGqlActionsSource => parent,
    },
  }),
});