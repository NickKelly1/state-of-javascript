import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { RolePermissionModel } from "../role-permission.model";


export type IRolePermissionGqlActionsSource = RolePermissionModel;
export const RolePermissionGqlActions = new GraphQLObjectType<IRolePermissionGqlActionsSource, GqlContext>({
  name: 'RolePermissionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy.canFindOne({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const [ role, permission ] = await Promise.all([
          ctx.loader.roles.load(parent.role_id).then(assertDefined),
          ctx.loader.permissions.load(parent.permission_id).then(assertDefined),
        ]);
        return ctx.services.rolePermissionPolicy.canHardDelete({ model: parent, role, permission });
      },
    },
  },
});
