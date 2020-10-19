import { GraphQLNonNull } from "graphql";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IRolePermissionGqlNode, RolePermissionGqlNode } from "./role-permission.gql.node";

export type IRolePermissionGqlEdge = IGqlEdge<IRolePermissionGqlNode>;
export const RolePermissionGqlEdge = GqlEdge({
  node: () => GraphQLNonNull(RolePermissionGqlNode),
  name: 'RolePermissionEdge',
});