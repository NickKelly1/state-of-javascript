import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { PermissionCategoryModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";

export type IPermissionCategoryGqlActionsSource = PermissionCategoryModel;
export const PermissionCategoryGqlActions = new GraphQLObjectType<IPermissionCategoryGqlActionsSource, GqlContext>({
  name: 'PermissionCategoryActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.permissionCategoryPolicy.canFindOne({ model: parent });
      },
    },
  },
});
