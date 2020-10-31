import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { NpmsDashboardItemModel, NpmsDashboardModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { INpmsDashboardItemCollectionGqlNodeSource, NpmsDashboardItemCollectionGqlNode } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.node";
import { NpmsDashboardItemCollectionOptionsGqlInput } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.options";
import { NpmsDashboardItemField } from "../../npms-dashboard-item/npms-dashboard-item.attributes";
import { INpmsDashboardCollectionGqlNodeSource, NpmsDashboardCollectionGqlNode } from "../../npms-dashboard/gql/npms-dashboard.collection.gql.node";
import { NpmsDashboardCollectionOptionsGqlInput } from "../../npms-dashboard/gql/npms-dashboard.collection.gql.options";
import { NpmsDashboardAssociation } from "../../npms-dashboard/npms-dashboard.associations";
import { NpmsPackageAssociation } from "../npms-package.associations";
import { NpmsPackageField } from "../npms-package.attributes";
import { NpmsPackageModel } from "../npms-package.model";


export type INpmsPackageGqlRelationsSource = NpmsPackageModel;
export const NpmsPackageGqlRelations: GraphQLObjectType<INpmsPackageGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsPackageRelations',
  fields: () => ({
    dashboardItems: {
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
              { [NpmsDashboardItemField.npms_package_id]: { [Op.eq]: parent.id } }
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
    dashboards: {
      type: GraphQLNonNull(NpmsDashboardCollectionGqlNode),
      args: gqlQueryArg(NpmsDashboardCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsDashboardCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.npmsDashboardRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([ options.where, ]),
            include: [{
              association: NpmsDashboardAssociation.npmsPackages,
              where: { [NpmsPackageField.id]: { [Op.eq]: parent.id }, },
            }],
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: INpmsDashboardCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<NpmsDashboardModel> =>
            ctx.services.npmsDashboardPolicy.canFindOne({ model })
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
