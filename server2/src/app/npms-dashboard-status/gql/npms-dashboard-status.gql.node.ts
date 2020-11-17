import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { NewsArticleStatusModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { INpmsDashboardStatusGqlActionsSource, NpmsDashboardStatusGqlActions } from "./npms-dashboard-status.gql.actions";
import { INpmsDashboardStatusGqlRelationsSource, NpmsDashboardStatusGqlRelations } from "./npms-dashboard-status.gql.relations";
import { INpmsDashboardStatusGqlDataSource, NpmsDashboardStatusGqlData } from "./npms-dashboard-status.gql.data";

export type INpmsDashboardStatusGqlNodeSource = NewsArticleStatusModel;
export const NpmsDashboardStatusGqlNode: GraphQLObjectType<INpmsDashboardStatusGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardStatusNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `npms_dashboard_status_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(NpmsDashboardStatusGqlData),
      resolve: (parent): INpmsDashboardStatusGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(NpmsDashboardStatusGqlActions),
      resolve: (parent): INpmsDashboardStatusGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(NpmsDashboardStatusGqlRelations),
      resolve: function (parent): INpmsDashboardStatusGqlRelationsSource {
        return parent;
      },
    },
  }),
});