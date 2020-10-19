import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { RoleModel } from "../../../circle";
import { GqlConnection, IGqlConnection } from "../../../common/gql/gql.connection";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IRoleGqlEdge, RoleGqlEdge } from "./role.gql.edge";
import { RoleGqlNode } from "./role.gql.node";

export type IRoleGqlConnection =  IGqlConnection<IRoleGqlEdge>;
export const RoleGqlConnection = GqlConnection({
  name: 'RoleGqlConnection',
  edge: () => GraphQLNonNull(RoleGqlEdge),
});
