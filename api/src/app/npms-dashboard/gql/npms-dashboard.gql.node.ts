import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { NpmsDashboardModel } from "../../../circle";
import { INpmsDashboardGqlActionsSource, NpmsDashboardGqlActions } from "./npms-dashboard.gql.actions";
import { INpmsDashboardGqlRelationsSource, NpmsDashboardGqlRelations } from "./npms-dashboard.gql.relations";
import { INpmsDashboardGqlDataSource, NpmsDashboardGqlData } from "./npms-dashboard.gql.data";
import { GqlContext } from "../../../common/context/gql.context";

export type INpmsDashboardGqlNodeSource = NpmsDashboardModel;
export const NpmsDashboardGqlNode: GraphQLObjectType<INpmsDashboardGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `npms_dashboard_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(NpmsDashboardGqlData),
      resolve: (parent): INpmsDashboardGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(NpmsDashboardGqlActions),
      resolve: (parent): INpmsDashboardGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(NpmsDashboardGqlRelations),
      resolve: function (parent): INpmsDashboardGqlRelationsSource {
        return parent;
      },
    },
  }),
});