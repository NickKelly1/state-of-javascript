import {
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";
import { PermissionModel } from "../permission.model";

export type IPermissionGqlActionsSource = PermissionModel;
export const PermissionGqlActions = new GraphQLObjectType<IPermissionGqlActionsSource, GqlContext>({
  name: 'PermissionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GqlAction),
      resolve: async (parent, args, ctx): Promise<IGqlActionSource> => {
        return { can: ctx.services.permissionPolicy().canFindOne({ model: parent }) };
      },
    },
    update: {
      type: GraphQLNonNull(GqlAction),
      resolve: async (parent, args, ctx): Promise<IGqlActionSource> => {
        return { can: ctx.services.permissionPolicy().canUpdate({ model: parent }) };
      },
    },
    delete: {
      type: GraphQLNonNull(GqlAction),
      resolve: async (parent, args, ctx): Promise<IGqlActionSource> => {
        return { can: ctx.services.permissionPolicy().canDelete({ model: parent }) };
      },
    },
  },
});
