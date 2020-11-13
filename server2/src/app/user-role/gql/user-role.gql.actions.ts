import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { UserRoleModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


export type IUserRoleGqlActionsSource = UserRoleModel;
export const UserRoleGqlActions = new GraphQLObjectType<IUserRoleGqlActionsSource, GqlContext>({
  name: 'UserRoleActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy.canFindOne({ model: parent });
      },
    },
  },
});
