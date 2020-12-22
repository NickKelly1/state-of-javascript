import { GraphQLObjectType } from "graphql";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { GqlContext } from "../../../common/context/gql.context";
import { BlogPostCommentModel } from "../../../circle";
import { BlogPostModel } from "../../blog-post/blog-post.model";
import { BlogPostGqlNode, IBlogPostGqlNodeSource } from "../../blog-post/gql/blog-post.gql.node";


export type IBlogPostCommentGqlRelationsSource = BlogPostCommentModel;
export const BlogPostCommentGqlRelations: GraphQLObjectType<IBlogPostCommentGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostCommentRelations',
  fields: () => ({
    author: {
      type: UserGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IUserGqlNodeSource>> => {
        const model: OrNull<IUserGqlNodeSource> = await ctx.loader.users.load(parent.author_id);
        if (!model) return null;
        if (!ctx.services.userPolicy.canFindOne({ model })) return null;
        return model;
      },
    },

    post: {
      type: BlogPostGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IBlogPostGqlNodeSource>> => {
        const model: OrNull<BlogPostModel> = await ctx.loader.blogPosts.load(parent.post_id);
        if (!model) return null;
        if (!ctx.services.blogPostPolicy.canFindOne({ model })) return null;
        return model;
      },
    },
  }),
});
