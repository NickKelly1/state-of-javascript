import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NpmsDashboardModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { NpmsDashboardAssociation } from "../npms-dashboard.associations";
import { INpmsDashboardCollectionGqlNodeSource, NpmsDashboardCollectionGqlNode } from "./npms-dashboard.collection.gql.node";
import { NpmsDashboardCollectionOptionsGqlInput } from "./npms-dashboard.collection.gql.options";

export const NpmsDashboardsGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  npmsDashboards: {
    type: GraphQLNonNull(NpmsDashboardCollectionGqlNode),
    args: gqlQueryArg(NpmsDashboardCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INpmsDashboardCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsDashboardPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.npmsDashboardRepository.findAllAndCount({
        runner: null,
        options: {
          ...options,
          // eager load statuses
          include: { association: NpmsDashboardAssociation.status, },
        },
      });
      // prime statuses
      rows.forEach(row => {
        const status = assertDefined(row.status);
        ctx.loader.npmsDashboardStatus.prime(status.id, status);
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: INpmsDashboardCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<NpmsDashboardModel> =>
          ctx.services.npmsDashboardPolicy.canFindOne({ model })
            ? model
            : null
          ),
        pagination,
      };
      return connection;
    },
  },
});