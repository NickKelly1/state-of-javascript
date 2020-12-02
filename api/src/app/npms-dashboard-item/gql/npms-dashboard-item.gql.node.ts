import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { NpmsDashboardItemModel } from "../../../circle";
import { INpmsDashboardItemGqlActionsSource, NpmsDashboardItemGqlActions } from "./npms-dashboard-item.gql.actions";
import { INpmsDashboardItemGqlRelationsSource, NpmsDashboardItemGqlRelations } from "./npms-dashboard-item.gql.relations";
import { INpmsDashboardItemGqlDataSource, NpmsDashboardItemGqlData } from "./npms-dashboard-item.gql.data";
import { GqlContext } from "../../../common/context/gql.context";

export type INpmsDashboardItemGqlNodeSource = NpmsDashboardItemModel;
export const NpmsDashboardItemGqlNode: GraphQLObjectType<INpmsDashboardItemGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardItemNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `npms_dashboard_item_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(NpmsDashboardItemGqlData),
      resolve: (parent): INpmsDashboardItemGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(NpmsDashboardItemGqlActions),
      resolve: (parent): INpmsDashboardItemGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(NpmsDashboardItemGqlRelations),
      resolve: function (parent): INpmsDashboardItemGqlRelationsSource {
        return parent;
      },
    },
  }),
});