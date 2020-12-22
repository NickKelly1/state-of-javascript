import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { BlogPostStatusModel } from "../blog-post-status.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";


export type IBlogPostStatusGqlDataSource = BlogPostStatusModel;
export const BlogPostStatusGqlData: GraphQLObjectType<BlogPostStatusModel, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostStatusData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    colour: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
  }),
});
