import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NpmsDashboardStatusLang } from "../npms-dashboard-status.lang";
import { INpmsDashboardStatusCollectionGqlNodeSource, NpmsDashboardStatusCollectionGqlNode } from "./npms-dashboard-status.collection.gql.node";
import { NpmsDashboardStatusCollectionOptionsGqlInput } from "./npms-dashboard-status.collection.gql.options";

export const NpmsDashboardStatusGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  npmsDashboardStatuses: {
    type: GraphQLNonNull(NpmsDashboardStatusCollectionGqlNode),
    args: gqlQueryArg(NpmsDashboardStatusCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INpmsDashboardStatusCollectionGqlNodeSource> => {
      ctx.authorize(
        ctx.services.npmsDashboardStatusPolicy.canFindMany(),
        NpmsDashboardStatusLang.CannotFindMany,
      );
      const collection = await ctx.services.npmsDashboardStatusRepository.gqlCollection({
        args,
        runner: null,
      });
      return collection;
    },
  },
});