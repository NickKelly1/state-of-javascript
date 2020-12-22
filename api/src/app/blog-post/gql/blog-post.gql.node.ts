import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { BlogPostModel } from "../../../circle";
import { IBlogPostGqlActionsSource, BlogPostGqlActions } from "./blog-post.gql.actions";
import { IBlogPostGqlRelationsSource, BlogPostGqlRelations } from "./blog-post.gql.relations";
import { IBlogPostGqlDataSource, BlogPostGqlData } from "./blog-post.gql.data";
import { GqlContext } from "../../../common/context/gql.context";

export type IBlogPostGqlNodeSource = BlogPostModel;
export const BlogPostGqlNode: GraphQLObjectType<IBlogPostGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `blog_post_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(BlogPostGqlData),
      resolve: (parent): IBlogPostGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(BlogPostGqlActions),
      resolve: (parent): IBlogPostGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(BlogPostGqlRelations),
      resolve: function (parent): IBlogPostGqlRelationsSource {
        return parent;
      },
    },
  }),
});