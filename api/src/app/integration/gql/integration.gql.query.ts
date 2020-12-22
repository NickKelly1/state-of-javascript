import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { IIntegrationCollectionGqlNodeSource, IntegrationCollectionGqlNode } from "./integration.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "./integration.collection.gql.options";
import { IntegrationLang } from '../integration.lang';

export const IntegrationGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  integrations: {
    type: GraphQLNonNull(IntegrationCollectionGqlNode),
    args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IIntegrationCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.integrationPolicy.canAccess(), IntegrationLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.integrationPolicy.canFindMany(), IntegrationLang.CannotFindMany);
      // find
      const collection = await ctx.services.integrationRepository.gqlCollection({
        runner: null,
        args,
      });
      return collection;
    },
  },
});
