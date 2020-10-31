import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { RolePermissionModel } from "../role-permission.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { OrNull } from "../../../common/types/or-null.type";


export type IRolePermissionGqlDataSource = RolePermissionModel;
export const RolePermissionGqlData: GraphQLObjectType<RolePermissionModel, GqlContext> = new GraphQLObjectType({
  name: 'RolePermissionData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    role_id: { type: GraphQLNonNull(GraphQLInt), },
    permission_id: { type: GraphQLNonNull(GraphQLInt), },
    ...AuditableGql,
  }),
});
