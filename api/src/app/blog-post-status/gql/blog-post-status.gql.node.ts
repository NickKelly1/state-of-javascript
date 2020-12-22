import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { BlogPostStatusModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { IBlogPostStatusGqlActionsSource, BlogPostStatusGqlActions } from "./blog-post-status.gql.actions";
import { IBlogPostStatusGqlRelationsSource, BlogPostStatusGqlRelations } from "./blog-post-status.gql.relations";
import { IBlogPostStatusGqlDataSource, BlogPostStatusGqlData } from "./blog-post-status.gql.data";

export type IBlogPostStatusGqlNodeSource = BlogPostStatusModel;
export const BlogPostStatusGqlNode: GraphQLObjectType<IBlogPostStatusGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostStatusNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `blog_post_status_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(BlogPostStatusGqlData),
      resolve: (parent): IBlogPostStatusGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(BlogPostStatusGqlActions),
      resolve: (parent): IBlogPostStatusGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(BlogPostStatusGqlRelations),
      resolve: function (parent): IBlogPostStatusGqlRelationsSource {
        return parent;
      },
    },
  }),
});