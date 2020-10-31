import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserRoleModel } from "../user-role.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { GqlContext } from "../../../common/context/gql.context";


export type IUserRoleGqlDataSource = UserRoleModel;
export const UserRoleGqlData: GraphQLObjectType<IUserRoleGqlDataSource, GqlContext> = new GraphQLObjectType({
  name: 'UserRoleData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    user_id: { type: GraphQLNonNull(GraphQLInt), },
    role_id: { type: GraphQLNonNull(GraphQLInt), },
    ...AuditableGql,
  }),
});
