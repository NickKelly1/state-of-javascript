import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { BlogPostModel } from "../../../circle";
import { IBlogPostGqlNodeSource, BlogPostGqlNode } from "./blog-post.gql.node";
import { IBlogPostCollectionGqlActionSource, BlogPostCollectionGqlActions } from "./blog-post.collection.gql.actions";


export interface IBlogPostCollectionGqlNodeSource {
  models: OrNull<BlogPostModel>[];
  pagination: ICollectionMeta;
}
export const BlogPostCollectionGqlNode: GraphQLObjectType<IBlogPostCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(BlogPostGqlNode)),
      resolve: (parent, args, ctx): OrNull<IBlogPostGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(BlogPostCollectionGqlActions),
      resolve: (parent, args, ctx): IBlogPostCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
