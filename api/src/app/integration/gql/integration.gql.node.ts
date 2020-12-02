
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { IntegrationModel } from "../integration.model";
import { IIntegrationGqlActionsSource, IntegrationGqlActions } from "./integration.gql.actions";
import { IIntegrationGqlRelationsSource, IntegrationGqlRelations } from "./integration.gql.relations";
import { IIntegrationGqlDataSource, IntegrationGqlData } from "./integration.gql.data";

export type IIntegrationGqlNodeSource = IntegrationModel;
export const IntegrationGqlNode: GraphQLObjectType<IIntegrationGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'IntegrationNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `integration_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(IntegrationGqlData),
      resolve: (parent): IIntegrationGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(IntegrationGqlActions),
      resolve: (parent): IIntegrationGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(IntegrationGqlRelations),
      resolve: function (parent): IIntegrationGqlRelationsSource {
        return parent;
      },
    },
  }),
});