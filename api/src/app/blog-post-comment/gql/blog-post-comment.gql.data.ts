import { GraphQLBoolean, GraphQLFloat, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { BlogPostCommentModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { BlogPostCommentField } from "../blog-post-comment.attributes";


export type IBlogPostCommentGqlDataSource = BlogPostCommentModel;
export const BlogPostCommentGqlData: GraphQLObjectType<BlogPostCommentModel, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostCommentData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent[BlogPostCommentField.id] },
    author_id: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent[BlogPostCommentField.author_id] },
    post_id: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent[BlogPostCommentField.post_id] },
    body: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[BlogPostCommentField.body] },
    hidden: { type: GraphQLNonNull(GraphQLBoolean), resolve: (parent): boolean => parent[BlogPostCommentField.hidden] },
    visible: { type: GraphQLNonNull(GraphQLBoolean), resolve: (parent): boolean => parent[BlogPostCommentField.visible] },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
