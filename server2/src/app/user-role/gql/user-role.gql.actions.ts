import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { UserRoleModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";


export type IUserRoleGqlActionsSource = UserRoleModel;
export const UserRoleGqlActions = new GraphQLObjectType<IUserRoleGqlActionsSource, GqlContext>({
  name: 'UserRoleActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async(parent, args, ctx): Promise<boolean> => {
        const [role, user] = await Promise.all([
          ctx.loader.roles.load(parent.role_id).then(assertDefined),
          ctx.loader.users.load(parent.user_id).then(assertDefined),
        ]);
        return ctx.services.userRolePolicy.canFindOne({
          model: parent,
          role,
          user,
        });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async(parent, args, ctx): Promise<boolean> => {
        const [role, user] = await Promise.all([
          ctx.loader.roles.load(parent.role_id).then(assertDefined),
          ctx.loader.users.load(parent.user_id).then(assertDefined),
        ]);
        return ctx.services.userRolePolicy.canHardDelete({
          model: parent,
          role,
          user,
        });
      },
    }
  },
});
