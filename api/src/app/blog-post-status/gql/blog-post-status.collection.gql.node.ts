import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlPagination, IGqlMetaSource } from "../../../common/gql/gql.pagination";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { BlogPostStatusModel } from "../../../circle";
import { IBlogPostStatusGqlNodeSource, BlogPostStatusGqlNode } from "./blog-post-status.gql.node";
import { BlogPostStatusCollectionGqlActions, IBlogPostStatusCollectionGqlActionSource } from "./blog-post-status.collection.gql.actions";


export interface IBlogPostStatusCollectionGqlNodeSource {
  models: OrNull<BlogPostStatusModel>[];
  pagination: ICollectionMeta;
}
export const BlogPostStatusCollectionGqlNode: GraphQLObjectType<IBlogPostStatusCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostStatusCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(BlogPostStatusGqlNode)),
      resolve: (parent, args, ctx): OrNull<IBlogPostStatusGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(BlogPostStatusCollectionGqlActions),
      resolve: (parent, args, ctx): IBlogPostStatusCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlPagination),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
