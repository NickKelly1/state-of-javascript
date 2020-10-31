import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NpmsDashboardItemModel } from "../npms-dashboard-item.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { NpmsDashboardItemField } from "../npms-dashboard-item.attributes";


export type INpmsDashboardItemGqlDataSource = NpmsDashboardItemModel;
export const NpmsDashboardItemGqlData: GraphQLObjectType<NpmsDashboardItemModel, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardItemData',
  fields: () => ({
    [NpmsDashboardItemField.id]: { type: GraphQLNonNull(GraphQLInt), },
    [NpmsDashboardItemField.dashboard_id]: { type: GraphQLNonNull(GraphQLInt), },
    [NpmsDashboardItemField.npms_package_id]: { type: GraphQLNonNull(GraphQLInt), },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
