import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { INpmsDashboardItemCollectionGqlNodeSource, NpmsDashboardItemCollectionGqlNode } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.node";
import { NpmsDashboardItemCollectionOptionsGqlInput } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.options";
import { NpmsDashboardItemField } from "../../npms-dashboard-item/npms-dashboard-item.attributes";
import { INpmsDashboardCollectionGqlNodeSource, NpmsDashboardCollectionGqlNode } from "../../npms-dashboard/gql/npms-dashboard.collection.gql.node";
import { NpmsDashboardCollectionOptionsGqlInput } from "../../npms-dashboard/gql/npms-dashboard.collection.gql.options";
import { NpmsDashboardAssociation } from "../../npms-dashboard/npms-dashboard.associations";
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
        const collection = await ctx.services.npmsDashboardItemRepository.gqlCollection({
          runner: null,
          args,
          where: { [NpmsDashboardItemField.npms_package_id]: { [Op.eq]: parent.id } },
        });
        return collection;
      },
    },

    dashboards: {
      type: GraphQLNonNull(NpmsDashboardCollectionGqlNode),
      args: gqlQueryArg(NpmsDashboardCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsDashboardCollectionGqlNodeSource> => {
        const collection = await ctx.services.npmsDashboardRepository.gqlCollection({
          runner: null,
          args,
          include: [{
            association: NpmsDashboardAssociation.npmsPackages,
            where: { [NpmsPackageField.id]: { [Op.eq]: parent.id }, },
          }],
        });
        return collection;
      },
    },
  }),
});
