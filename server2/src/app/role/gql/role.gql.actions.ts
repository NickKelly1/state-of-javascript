import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";
import { RoleModel } from "../role.model";

export type IRoleGqlActionsSource = RoleModel;
export const RoleGqlActions = new GraphQLObjectType<IRoleGqlActionsSource, GqlContext>({
  name: 'RoleActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy().canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy().canUpdate({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy().canDelete({ model: parent });
      },
    },
  },
});
