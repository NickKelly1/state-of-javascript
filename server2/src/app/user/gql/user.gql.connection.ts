import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserModel } from "../user.model";
import { UserRoleModel } from "../../../circle";
import { GqlConnection, IGqlConnection } from "../../../common/gql/gql.connection";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IUserGqlEdge, UserGqlEdge } from "./user.gql.edge";
import { UserGqlNode } from "./user.gql.node";
import { OrNull } from "../../../common/types/or-null.type";

export type IUserGqlConnection =  IGqlConnection<OrNull<IUserGqlEdge>>;
export const UserGqlConnection = GqlConnection({
  name: 'UserConnection',
  // allowed to be null
  edge: () => UserGqlEdge,
});
