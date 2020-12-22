import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NpmsDashboardItemLang } from "../npms-dashboard-item.lang";
import { INpmsDashboardItemCollectionGqlNodeSource, NpmsDashboardItemCollectionGqlNode } from "./npms-dashboard-item.collection.gql.node";
import { NpmsDashboardItemCollectionOptionsGqlInput } from "./npms-dashboard-item.collection.gql.options";

export const NpmsDashboardItemsGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  npmsDashboardItems: {
    type: GraphQLNonNull(NpmsDashboardItemCollectionGqlNode),
    args: gqlQueryArg(NpmsDashboardItemCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INpmsDashboardItemCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.npmsDashboardItemPolicy.canAccess(), NpmsDashboardItemLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.npmsDashboardItemPolicy.canFindMany(), NpmsDashboardItemLang.CannotFindMany);
      // find
      const collection = await ctx.services.npmsDashboardItemRepository.gqlCollection({
        runner: null,
        args,
      });
      return collection;
    },
  },
});