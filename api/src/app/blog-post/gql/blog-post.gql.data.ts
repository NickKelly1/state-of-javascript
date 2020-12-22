import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { BlogPostModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { BlogPostField } from "../blog-post.attributes";


export type IBlogPostGqlDataSource = BlogPostModel;
export const BlogPostGqlData: GraphQLObjectType<BlogPostModel, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), resolve: (parent): number => parent[BlogPostField.id] },
    title: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[BlogPostField.title] },
    teaser: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[BlogPostField.teaser] },
    body: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[BlogPostField.body] },
    author_id: { type: GraphQLNonNull(GraphQLInt), resolve: (parent): number => parent[BlogPostField.author_id] },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
