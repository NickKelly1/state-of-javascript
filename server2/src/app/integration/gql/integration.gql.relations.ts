import { GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IntegrationModel } from "../integration.model";
import { IntegrationGqlNode } from "./integration.gql.node";

export type IIntegrationGqlRelationsSource = IntegrationModel;
export const IntegrationGqlRelations = new GraphQLObjectType<IIntegrationGqlRelationsSource, GqlContext>({
  name: 'IntegrationRelations',
  fields: () => ({
    // no relations currently.... this is a placeholder
    self: {
      type: IntegrationGqlNode,
      resolve: (parent) => parent,
    },
  }),
});
