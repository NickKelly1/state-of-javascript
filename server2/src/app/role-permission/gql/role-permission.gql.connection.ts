import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserModel } from "../../user/user.model";
import { RolePermissionModel } from "../../../circle";
import { GqlConnection, IGqlConnection } from "../../../common/gql/gql.connection";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IRolePermissionGqlEdge, RolePermissionGqlEdge } from "./role-permission.gql.edge";
import { IRolePermissionGqlNode } from "./role-permission.gql.node";
import { OrNull } from "../../../common/types/or-null.type";

export type IRolePermissionGqlConnection =  IGqlConnection<OrNull<IRolePermissionGqlEdge>>;
export const RolePermissionGqlConnection = GqlConnection({
  name: 'RolePermissionConnection',
  edge: () => RolePermissionGqlEdge,
});
