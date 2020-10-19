import { GraphQLNonNull } from "graphql";
import { GqlConnection, IGqlConnection } from "../../../common/gql/gql.connection";
import { IPermissionGqlEdge, PermissionGqlEdge } from "./permission.gql.edge";

export type IPermissionGqlConnection =  IGqlConnection<IPermissionGqlEdge>;
export const PermissionGqlConnection = GqlConnection({
  name: 'PermissionConnection',
  edge: () => GraphQLNonNull(PermissionGqlEdge),
});
