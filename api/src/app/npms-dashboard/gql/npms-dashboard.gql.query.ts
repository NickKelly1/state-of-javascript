import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NpmsDashboardLang } from "../npms-dashboard.lang";
import { INpmsDashboardCollectionGqlNodeSource, NpmsDashboardCollectionGqlNode } from "./npms-dashboard.collection.gql.node";
import { NpmsDashboardCollectionOptionsGqlInput } from "./npms-dashboard.collection.gql.options";

export const NpmsDashboardsGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  npmsDashboards: {
    type: GraphQLNonNull(NpmsDashboardCollectionGqlNode),
    args: gqlQueryArg(NpmsDashboardCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INpmsDashboardCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.npmsDashboardPolicy.canAccess(), NpmsDashboardLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.npmsDashboardPolicy.canFindMany(), NpmsDashboardLang.CannotFindMany);
      // find
      const collection = await ctx.services.npmsDashboardRepository.gqlCollection({
        args,
        runner: null,
      });
      return collection;
    },
  },
});