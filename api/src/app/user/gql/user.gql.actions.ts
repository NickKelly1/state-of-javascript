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
    forceUpdateEmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canForceUpdateEmail({ model: parent });
      },
    },
    forceVerify: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canForceVerify({ model: parent });
      },
    },
    login: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.authPolicy.canLoginAs({ model: parent });
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
    requestWelcomeEmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userEmailPolicy.canRequestWelcomeEmail({ model: parent });
      },
    },
    consumeWelcomeToken: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userEmailPolicy.canConsumeWelcomeToken({ model: parent });
      },
    },
    requestVerificationEmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userEmailPolicy.canRequestVerificationEmail({ model: parent });
      },
    },
    consumeVerificationToken: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userEmailPolicy.canConsumeVerificationToken({ model: parent });
      },
    },
    requestEmailChangeEmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userEmailPolicy.canRequestEmailChangeEmail({ model: parent });
      },
    },
    consumeEmailChangeToken: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userEmailPolicy.canConsumeEmailChangeToken({ model: parent });
      },
    },
    requestPasswordResetEmail: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userEmailPolicy.canRequestPasswordResetEmail({ model: parent });
      },
    },
    consumePasswordResetToken: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userEmailPolicy.canConsumePasswordResetToken({ model: parent });
      },
    },
  },
});
