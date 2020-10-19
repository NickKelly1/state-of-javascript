import { GraphQLNonNull } from "graphql";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IPermissionGqlNode, PermissionGqlNode } from "./permission.gql.node";

export type IPermissionGqlEdge = IGqlEdge<IPermissionGqlNode>
export const PermissionGqlEdge = GqlEdge({
  name: 'PermissionEdge',
  node: () => GraphQLNonNull(PermissionGqlNode),
});
