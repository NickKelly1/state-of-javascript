import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { PermissionCategoryModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";

export type IPermissionCategoryGqlDataSource = PermissionCategoryModel;
export const PermissionCategoryGqlData: GraphQLObjectType<IPermissionCategoryGqlDataSource, GqlContext> = new GraphQLObjectType({
  name: 'PermissionCategoryData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    colour: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
