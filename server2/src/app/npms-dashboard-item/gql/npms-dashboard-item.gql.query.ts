import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NpmsDashboardItemModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { concatIncludables } from "../../../common/helpers/concat-includables.helper";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { NpmsDashboardItemAssociation } from "../npms-dashboard-item.associations";
import { INpmsDashboardItemCollectionGqlNodeSource, NpmsDashboardItemCollectionGqlNode } from "./npms-dashboard-item.collection.gql.node";
import { NpmsDashboardItemCollectionOptionsGqlInput } from "./npms-dashboard-item.collection.gql.options";

export const NpmsDashboardItemsGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  npmsDashboardItems: {
    type: GraphQLNonNull(NpmsDashboardItemCollectionGqlNode),
    args: gqlQueryArg(NpmsDashboardItemCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INpmsDashboardItemCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsDashboardItemPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.npmsDashboardItemRepository.findAllAndCount({
        runner: null,
        options: {
          ...options,
          include: concatIncludables([
            options.include,
            [{ association: NpmsDashboardItemAssociation.dashboard }],
          ]),
        },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });

      // prime dashboards....
      rows
        .map(row => assertDefined(row.dashboard))
        .forEach(dashboard => ctx.loader.npmsDashboard.prime(dashboard.id, assertDefined(dashboard)));

      const connection: INpmsDashboardItemCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<NpmsDashboardItemModel> =>
          ctx.services.npmsDashboardItemPolicy.canFindOne({ model, dashboard: assertDefined(model.dashboard), })
            ? model
            : null
          ),
        pagination,
      };
      return connection;
    },
  },
});