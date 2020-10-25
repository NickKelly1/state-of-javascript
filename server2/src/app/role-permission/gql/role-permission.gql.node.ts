import { GraphQLNonNull } from "graphql";
import { IRolePermissionGqlRelationsSource, RolePermissionGqlRelations } from "./role-permission.gql.relations";
import { GraphQLObjectType, GraphQLString  } from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { RolePermissionModel } from "../role-permission.model";
import { IRolePermissionGqlDataSource, RolePermissionGqlData } from "./role-permission.gql.data";
import { IRolePermissionGqlActionsSource, RolePermissionGqlActions } from "./role-permission.gql.actions";

export type IRolePermissionGqlNodeSource = RolePermissionModel;
export const RolePermissionGqlNode: GraphQLObjectType<IRolePermissionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'RolePermissionNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `role_permission_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(RolePermissionGqlData),
      resolve: (parent): IRolePermissionGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(RolePermissionGqlActions),
      resolve: (parent): IRolePermissionGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(RolePermissionGqlRelations),
      resolve: (parent): IRolePermissionGqlRelationsSource => parent,
    },
  }),
});