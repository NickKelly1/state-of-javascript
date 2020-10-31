import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NpmsDashboardModel } from "../npms-dashboard.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";


export type INpmsDashboardGqlDataSource = NpmsDashboardModel;
export const NpmsDashboardGqlData: GraphQLObjectType<NpmsDashboardModel, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
