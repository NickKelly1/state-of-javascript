import { GraphQLNonNull } from "graphql";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IRoleGqlNode, RoleGqlNode } from "./role.gql.node";

export type IRoleGqlEdge = IGqlEdge<IRoleGqlNode>
export const RoleGqlEdge = GqlEdge({
  name: 'RoleEdge',
  node: () => GraphQLNonNull(RoleGqlNode),
});
