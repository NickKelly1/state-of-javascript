import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { BlogPostCommentModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";


export type IBlogPostCommentGqlActionsSource = BlogPostCommentModel;
export const BlogPostCommentGqlActions = new GraphQLObjectType<IBlogPostCommentGqlActionsSource, GqlContext>({
  name: 'BlogPostCommentActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const post = assertDefined(await ctx.loader.blogPosts.load(parent.post_id));
        return ctx.services.blogPostCommentPolicy.canFindOne({ model: parent, post });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const post = assertDefined(await ctx.loader.blogPosts.load(parent.post_id));
        return ctx.services.blogPostCommentPolicy.canUpdate({ model: parent, post });
      },
    },
    softDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const post = assertDefined(await ctx.loader.blogPosts.load(parent.post_id));
        return ctx.services.blogPostCommentPolicy.canSoftDelete({ model: parent, post });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const post = assertDefined(await ctx.loader.blogPosts.load(parent.post_id));
        return ctx.services.blogPostCommentPolicy.canHardDelete({ model: parent, post });
      },
    },
    restore: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const post = assertDefined(await ctx.loader.blogPosts.load(parent.post_id));
        return ctx.services.blogPostCommentPolicy.canRestore({ model: parent, post });
      },
    },
    vanish: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const post = assertDefined(await ctx.loader.blogPosts.load(parent.post_id));
        return ctx.services.blogPostCommentPolicy.canVanish({ model: parent, post });
      },
    },
    hide: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const post = assertDefined(await ctx.loader.blogPosts.load(parent.post_id));
        return ctx.services.blogPostCommentPolicy.canHide({ model: parent, post });
      },
    },
  },
});
