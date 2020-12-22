import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { BlogPostModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


export type IBlogPostGqlActionsSource = BlogPostModel;
export const BlogPostGqlActions = new GraphQLObjectType<IBlogPostGqlActionsSource, GqlContext>({
  name: 'BlogPostActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.blogPostPolicy.canFindOne({ model: parent });
      },
    },
    showComments: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.blogPostCommentPolicy.canFindManyForBlogPost({ post: parent });
      },
    },
    createComments: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.blogPostCommentPolicy.canCreateForBlogPost({ post: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canUpdate({ model: parent });
      },
    },
    softDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canSoftDelete({ model: parent });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canHardDelete({ model: parent });
      },
    },
    restore: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canRestore({ model: parent });
      },
    },
    submit: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canSubmit({ model: parent });
      },
    },
    reject: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canReject({ model: parent });
      },
    },
    approve: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canApprove({ model: parent });
      },
    },
    publish: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canPublish({ model: parent, });
      },
    },
    unpublish: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canUnpublish({ model: parent, });
      },
    },
  },
});
