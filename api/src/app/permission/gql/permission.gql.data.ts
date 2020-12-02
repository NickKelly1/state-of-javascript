import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { PermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";

export type IPermissionGqlDataSource = PermissionModel;
export const PermissionGqlData: GraphQLObjectType<IPermissionGqlDataSource, GqlContext> = new GraphQLObjectType({
  name: 'PermissionData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    category_id: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
