import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { UserModel } from "../user.model";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";


export type IUserGqlActionsSource = UserModel;
export const UserGqlActions = new GraphQLObjectType<IUserGqlActionsSource, GqlContext>({
  name: 'UserActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy().canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy().canUpdate({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy().canDelete({ model: parent });
      },
    },
  },
});
