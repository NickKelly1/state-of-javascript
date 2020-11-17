import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NpmsDashboardStatusModel } from "../npms-dashboard-status.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";


export type INpmsDashboardStatusGqlDataSource = NpmsDashboardStatusModel;
export const NpmsDashboardStatusGqlData: GraphQLObjectType<NpmsDashboardStatusModel, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardStatusData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
  }),
});
