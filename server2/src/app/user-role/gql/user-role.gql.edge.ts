import { GraphQLNonNull } from "graphql";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IUserRoleGqlNode, UserRoleGqlNode } from "./user-role.gql.node";

export type IUserRoleGqlEdge = IGqlEdge<IUserRoleGqlNode>;
export const UserRoleGqlEdge = GqlEdge({
  node: () => GraphQLNonNull(UserRoleGqlNode),
  name: 'UserRoleEdge',
});