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
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy.canDelete({ model: parent });
      },
    },
    createUserRole: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy.canCreateForRole({ role: parent });
      },
    },
    deleteUserRole: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy.canDeleteForRole({ role: parent });
      },
    },
    createRolePermission: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy.canCreateForRole({ role: parent });
      },
    },
    deleteRolePermission: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy.canDeleteForRole({ role: parent });
      },
    },
  },
});
