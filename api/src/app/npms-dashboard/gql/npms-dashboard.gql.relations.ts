import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { NpmsDashboardModel } from "../npms-dashboard.model";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { Op } from "sequelize";
import { NpmsDashboardItemCollectionGqlNode, INpmsDashboardItemCollectionGqlNodeSource } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.node";
import { NpmsDashboardItemCollectionOptionsGqlInput } from "../../npms-dashboard-item/gql/npms-dashboard-item.collection.gql.options";
import { NpmsDashboardItemField } from "../../npms-dashboard-item/npms-dashboard-item.attributes";
import { INpmsPackageCollectionGqlNodeSource, NpmsPackageCollectionGqlNode } from "../../npms-package/gql/npms-package.collection.gql.node";
import { NpmsPackageCollectionOptionsGqlInput } from "../../npms-package/gql/npms-package.collection.gql.options";
import { NpmsPackageAssociation } from "../../npms-package/npms-package.associations";
import { INpmsDashboardStatusGqlNodeSource, NpmsDashboardStatusGqlNode } from "../../npms-dashboard-status/gql/npms-dashboard-status.gql.node";
import { NpmsDashboardStatusModel } from "../../npms-dashboard-status/npms-dashboard-status.model";


export type INpmsDashboardGqlRelationsSource = NpmsDashboardModel;
export const NpmsDashboardGqlRelations: GraphQLObjectType<INpmsDashboardGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardRelations',
  fields: () => ({
    /**
     * Status
     */
    status: {
      type: NpmsDashboardStatusGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<INpmsDashboardStatusGqlNodeSource>> => {
        const model: OrNull<NpmsDashboardStatusModel> = await ctx.loader.npmsDashboardStatus.load(parent.status_id);
        if (!model) return null;
        if (!ctx.services.npmsDashboardStatusPolicy.canFindOne({ model })) return null;
        return model;
      },
    },

    /**
     * Items
     */
    items: {
      type: GraphQLNonNull(NpmsDashboardItemCollectionGqlNode),
      args: gqlQueryArg(NpmsDashboardItemCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsDashboardItemCollectionGqlNodeSource> => {
        const collection = await ctx.services.npmsDashboardItemRepository.gqlCollection({
          runner: null,
          args,
          where: { [NpmsDashboardItemField.dashboard_id]: { [Op.eq]: parent.id } },
        });
        return collection;
      },
    },

    /**
     * Packages
     */
    npmsPackages: {
      type: GraphQLNonNull(NpmsPackageCollectionGqlNode),
      args: gqlQueryArg(NpmsPackageCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsPackageCollectionGqlNodeSource> => {
        const collection = await ctx.services.npmsPackageRepository.gqlCollection({
          runner: null,
          args,
          include: [
            {
              association: NpmsPackageAssociation.dashboards,
              where: { id: { [Op.eq]: parent.id }, },
            }, {
              association: NpmsPackageAssociation.dashboard_items,
              // TODO: this order doesn't seem to work?
              // order: [[NpmsDashboardItemField.order, 'ASC']],
            }
          ],
        });
        return collection;
      },
    },
  }),
});
