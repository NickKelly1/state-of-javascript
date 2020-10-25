import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserRoleModel } from "../user-role.model";
import { GqlContext } from "../../../common/classes/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";


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
