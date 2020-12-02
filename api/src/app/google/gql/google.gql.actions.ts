import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { IntegrationModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";

export type IGoogleGqlActionsSource = IntegrationModel;
export const GoogleGqlActions = new GraphQLObjectType<IGoogleGqlActionsSource, GqlContext>({
  name: 'GoogleActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.integrationPolicy.canFindOne({ model: parent });
      },
    },
    oauth2: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.googlePolicy.canOAuth2({ model: parent });
      },
    },
    sendGmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.googlePolicy.canSendGmail({ model: parent });
      },
    }
  },
});
