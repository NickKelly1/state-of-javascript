import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { UserModel } from "../user.model";


export type IUserGqlActionsSource = UserModel;
export const UserGqlActions = new GraphQLObjectType<IUserGqlActionsSource, GqlContext>({
  name: 'UserActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canUpdate({ model: parent });
      },
    },
    softDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canSoftDelete({ model: parent });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canHardDelete({ model: parent });
      },
    },
    restore: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canRestore({ model: parent });
      },
    },
    deactivate: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canDeactivate({ model: parent });
      },
    },
    login: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canLoginAs({ model: parent });
      },
    },
    updatePassword: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canUpdatePassword({ model: parent });
      },
    },
    createUserRoles: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy.canCreateForUser({ user: parent });
      },
    },
    hardDeleteUserRoles: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy.canHardDeleteForUser({ user: parent });
      },
    },
    requestWelcome: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canRequestWelcome({ model: parent });
      },
    },
    acceptWelcome: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canAcceptWelcome({ model: parent });
      },
    },
    requestVerificationEmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canRequestVerificationEmail({ model: parent });
      },
    },
    consumeVerificationEmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canConsumeVerificationEmail({ model: parent });
      },
    },
    requestEmailChange: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canRequestEmailChange({ model: parent });
      },
    },
    consumeEmailChangeVerificationEmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canConsumeEmailChangeVerificationEmail({ model: parent });
      },
    },
    requestForgottenPasswordReset: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canRequestForgottenPasswordReset({ model: parent });
      },
    },
    consumeForgottenPasswordReset: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canAcceptForgottenPasswordReset({ model: parent });
      },
    },
  },
});
