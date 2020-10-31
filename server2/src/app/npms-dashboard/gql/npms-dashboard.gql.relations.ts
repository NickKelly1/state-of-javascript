import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { NpmsDashboardModel } from "../npms-dashboard.model";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { Op } from "sequelize";
import { NpmsDashboardItemModel, NpmsPackageModel } from "../../../circle";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { NpmsDashboardItemCollectionGqlNode, INpmsDashboardItemCollectionGqlNodeSource } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.node";
import { NpmsDashboardItemCollectionOptionsGqlInput } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.options";
import { NpmsDashboardItemField } from "../../npms-dashboard-item/npms-dashboard-item.attributes";
import { INpmsPackageCollectionGqlNodeSource, NpmsPackageCollectionGqlNode } from "../../npms-package/gql/npms-package.collection.gql.node";
import { NpmsPackageCollectionOptionsGqlInput } from "../../npms-package/gql/npms-package.collection.gql.options";
import { NpmsPackageAssociation } from "../../npms-package/npms-package.associations";


export type INpmsDashboardGqlRelationsSource = NpmsDashboardModel;
export const NpmsDashboardGqlRelations: GraphQLObjectType<INpmsDashboardGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardRelations',
  fields: () => ({
    items: {
      type: GraphQLNonNull(NpmsDashboardItemCollectionGqlNode),
      args: gqlQueryArg(NpmsDashboardItemCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsDashboardItemCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.npmsDashboardItemRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [NpmsDashboardItemField.dashboard_id]: { [Op.eq]: parent.id } }
            ]),
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: INpmsDashboardItemCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<NpmsDashboardItemModel> =>
            ctx.services.npmsDashboardItemPolicy.canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },
    npmsPackages: {
      type: GraphQLNonNull(NpmsPackageCollectionGqlNode),
      args: gqlQueryArg(NpmsPackageCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsPackageCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.npmsPackageRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([ options.where, ]),
            include: [{
              association: NpmsPackageAssociation.dashboards,
              where: { id: { [Op.eq]: parent.id }, },
            }],
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: INpmsPackageCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<NpmsPackageModel> =>
            ctx.services.npmsPackagePolicy.canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },
  }),
});
