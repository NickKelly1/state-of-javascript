import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { RoleModel } from "../role.model";

export type IRoleGqlActionsSource = RoleModel;
export const RoleGqlActions = new GraphQLObjectType<IRoleGqlActionsSource, GqlContext>({
  name: 'RoleActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy.canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy.canUpdate({ model: parent });
      },
    },
    softDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy.canSoftDelete({ model: parent });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy.canHardDelete({ model: parent });
      },
    },
    createUserRoles: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy.canCreateForRole({ role: parent });
      },
    },
    hardDeleteUserRoles: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy.canHardDeleteForRole({ role: parent });
      },
    },
    createRolePermissions: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy.canCreateForRole({ role: parent });
      },
    },
    hardDeleteRolePermissions: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy.canHardDeleteForRole({ role: parent });
      },
    },
  },
});
