import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";
import { RolePermissionModel } from "../role-permission.model";


export type IRolePermissionGqlActionsSource = RolePermissionModel;
export const RolePermissionGqlActions = new GraphQLObjectType<IRolePermissionGqlActionsSource, GqlContext>({
  name: 'RolePermissionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy().canFindOne({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy().canDelete({ model: parent });
      },
    },
  },
});
