import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { PermissionModel } from "../permission.model";

export type IPermissionGqlActionsSource = PermissionModel;
export const PermissionGqlActions = new GraphQLObjectType<IPermissionGqlActionsSource, GqlContext>({
  name: 'PermissionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.permissionPolicy.canFindOne({ model: parent });
      },
    },
    createRolePermission: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy.canCreateForPermission({ permission: parent });
      },
    },
    deleteRolePermission: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy.canDeleteForPermission({ permission: parent });
      },
    },
  },
});
