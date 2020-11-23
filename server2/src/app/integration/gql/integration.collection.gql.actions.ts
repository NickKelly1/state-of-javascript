import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IIntegrationCollectionGqlActionSource = IGqlNever;
export const IntegrationCollectionGqlActions = new GraphQLObjectType<IIntegrationCollectionGqlActionSource, GqlContext>({
  name: 'IntegrationCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.integrationPolicy.canFindMany();
      },
    },
    initialise: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.integrationPolicy.canInititialise();
      },
    },
    authenticateGoogle: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.integrationPolicy.canAuthenticateGoogle();
      },
    },
    sendGmails: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.integrationPolicy.canSendGmails();
      },
    }
  },
});
