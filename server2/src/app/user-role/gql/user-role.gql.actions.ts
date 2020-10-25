import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { UserRoleModel } from "../../../circle";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";


export type IUserRoleGqlActionsSource = UserRoleModel;
export const UserRoleGqlActions = new GraphQLObjectType<IUserRoleGqlActionsSource, GqlContext>({
  name: 'UserRoleActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy().canFindOne({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy().canDelete({ model: parent });
      },
    },
  },
});
