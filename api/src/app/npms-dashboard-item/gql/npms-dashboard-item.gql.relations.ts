import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { NpmsDashboardItemModel } from "../npms-dashboard-item.model";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlContext } from "../../../common/context/gql.context";
import { INpmsDashboardGqlNodeSource, NpmsDashboardGqlNode } from "../../npms-dashboard/gql/npms-dashboard.gql.node";
import { INpmsPackageGqlNodeSource, NpmsPackageGqlNode } from "../../npms-package/gql/npms-package.gql.node";


export type INpmsDashboardItemGqlRelationsSource = NpmsDashboardItemModel;
export const NpmsDashboardItemGqlRelations: GraphQLObjectType<INpmsDashboardItemGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardItemRelations',
  fields: () => ({
    /**
     * Dashboard
     */
    dashboard: {
      type: NpmsDashboardGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<INpmsDashboardGqlNodeSource>> => {
        const model: OrNull<INpmsDashboardGqlNodeSource> = await ctx.loader.npmsDashboard.load(parent.dashboard_id);
        if (!model) return null;
        if (!ctx.services.npmsDashboardPolicy.canFindOne({ model })) return null;
        return model;
      },
    },

    /**
     * NpmsPackage
     */
    npmsPackage: {
      type: NpmsPackageGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<INpmsPackageGqlNodeSource>> => {
        const model: OrNull<INpmsPackageGqlNodeSource> = await ctx.loader.npmsPackage.load(parent.npms_package_id);
        if (!model) return null;
        if (!ctx.services.npmsPackagePolicy.canFindOne({ model })) return null;
        return model;
      },
    },
  }),
});
