import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserModel } from "../../user/user.model";
import { UserRoleModel } from "../../../circle";
import { GqlConnection, IGqlConnection } from "../../../common/gql/gql.connection";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { IUserRoleGqlEdge, UserRoleGqlEdge } from "./user-role.gql.edge";
import { IUserRoleGqlNode } from "./user-role.gql.node";
import { OrNull } from "../../../common/types/or-null.type";

export type IUserRoleGqlConnection =  IGqlConnection<OrNull<IUserRoleGqlEdge>>;
export const UserRoleGqlConnection = GqlConnection({
  name: 'UserRoleConnection',
  edge: () => UserRoleGqlEdge,
});
