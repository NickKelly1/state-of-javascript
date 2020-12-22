import { GraphQLNonNull, GraphQLObjectType, } from "graphql";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { GqlContext } from "../../../common/context/gql.context";
import { BlogPostModel } from "../../../circle";
import { IBlogPostStatusGqlNodeSource } from "../../blog-post-status/gql/blog-post-status.gql.node";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { BlogPostCommentLang } from "../../blog-post-comment/blog-post-comment.lang";
import { BlogPostCommentCollectionGqlNode, IBlogPostCommentCollectionGqlNodeSource } from "../../blog-post-comment/gql/blog-post-comment.collection.gql.node";
import { BlogPostCommentCollectionOptionsGqlInput } from "../../blog-post-comment/gql/blog-post-comment.collection.gql.options";
import { BlogPostCommentField } from "../../blog-post-comment/blog-post-comment.attributes";
import { Op } from "sequelize";


export type IBlogPostGqlRelationsSource = BlogPostModel;
export const BlogPostGqlRelations: GraphQLObjectType<IBlogPostGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostRelations',
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

    status: {
      type: UserGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IBlogPostStatusGqlNodeSource>> => {
        const model: OrNull<IBlogPostStatusGqlNodeSource> = await ctx.loader.blogPostStatus.load(parent.status_id);
        if (!model) return null;
        if (!ctx.services.blogPostStatusPolicy.canFindOne({ model })) return null;
        return model;
      },
    },

    comments: {
      type: GraphQLNonNull(BlogPostCommentCollectionGqlNode),
      args: gqlQueryArg(BlogPostCommentCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IBlogPostCommentCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.userPolicy.canFindMany(), BlogPostCommentLang.CannotFindMany);
        const collection = ctx.services.blogPostCommentRepository.gqlCollection({
          runner: null,
          args,
          where: { [BlogPostCommentField.post_id]: { [Op.eq]: parent.id, }, },
        });
        return collection;
      },
    },
  }),
});
