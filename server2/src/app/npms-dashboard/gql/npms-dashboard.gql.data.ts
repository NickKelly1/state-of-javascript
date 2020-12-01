import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NpmsDashboardModel } from "../npms-dashboard.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { NpmsDashboardField } from "../npms-dashboard.attributes";


export type INpmsDashboardGqlDataSource = NpmsDashboardModel;
export const NpmsDashboardGqlData: GraphQLObjectType<NpmsDashboardModel, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardData',
  fields: () => ({
    ownedByMe: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => parent.isOwnedBy(ctx.auth),
    },
    [NpmsDashboardField.id]: { type: GraphQLNonNull(GraphQLInt), },
    [NpmsDashboardField.name]: { type: GraphQLNonNull(GraphQLString), },
    [NpmsDashboardField.order]: { type: GraphQLNonNull(GraphQLInt), },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
