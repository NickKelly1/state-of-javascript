import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IntegrationModel } from "../integration.model";

export type IIntegrationGqlActionsSource = IntegrationModel;
export const IntegrationGqlActions = new GraphQLObjectType<IIntegrationGqlActionsSource, GqlContext>({
  name: 'IntegrationActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.integrationPolicy.canFindOne({ model: parent });
      },
    },
    initialise: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.integrationPolicy.canInititialiseOne({ model: parent });
      },
    },
  },
});
