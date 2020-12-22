import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { BlogPostCommentModel } from "../../../circle";
import { IBlogPostCommentGqlActionsSource, BlogPostCommentGqlActions } from "./blog-post-comment.gql.actions";
import { IBlogPostCommentGqlRelationsSource, BlogPostCommentGqlRelations } from "./blog-post-comment.gql.relations";
import { IBlogPostCommentGqlDataSource, BlogPostCommentGqlData } from "./blog-post-comment.gql.data";
import { GqlContext } from "../../../common/context/gql.context";

export type IBlogPostCommentGqlNodeSource = BlogPostCommentModel;
export const BlogPostCommentGqlNode: GraphQLObjectType<IBlogPostCommentGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostCommentNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `blog_post_comment_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(BlogPostCommentGqlData),
      resolve: (parent): IBlogPostCommentGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(BlogPostCommentGqlActions),
      resolve: (parent): IBlogPostCommentGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(BlogPostCommentGqlRelations),
      resolve: function (parent): IBlogPostCommentGqlRelationsSource {
        return parent;
      },
    },
  }),
});