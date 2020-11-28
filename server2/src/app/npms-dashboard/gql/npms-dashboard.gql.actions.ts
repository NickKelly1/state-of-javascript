import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { NpmsDashboardModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


export type INpmsDashboardGqlActionsSource = NpmsDashboardModel;
export const NpmsDashboardGqlActions = new GraphQLObjectType<INpmsDashboardGqlActionsSource, GqlContext>({
  name: 'NpmsDashboardActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsDashboardPolicy.canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canUpdate({ model: parent });
      },
    },
    softDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canSoftDelete({ model: parent });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canHardDelete({ model: parent });
      },
    },
    restore: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canRestore({ model: parent });
      },
    },
    createNpmsDashboardItem: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardItemPolicy.canCreateForDashboard({ dashboard: parent });
      },
    },
    hardDeleteNpmsDashboardItem: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardItemPolicy.canHardDeleteForDashboard({ dashboard: parent });
      },
    },
    submit: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canSubmit({ model: parent });
      },
    },
    reject: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canReject({ model: parent });
      },
    },
    approve: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canApprove({ model: parent });
      },
    },
    publish: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canPublish({ model: parent, });
      },
    },
    unpublish: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canUnpublish({ model: parent, });
      },
    },
  },
});
