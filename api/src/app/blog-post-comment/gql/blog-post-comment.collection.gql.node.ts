import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { BlogPostCommentModel } from "../../../circle";
import { IBlogPostCommentGqlNodeSource, BlogPostCommentGqlNode } from "./blog-post-comment.gql.node";
import { BlogPostCommentCollectionGqlActions, IBlogPostCommentCollectionGqlActionSource } from "./blog-post-comment.collection.gql.actions";


export interface IBlogPostCommentCollectionGqlNodeSource {
  models: OrNull<BlogPostCommentModel>[];
  pagination: ICollectionMeta;
}
export const BlogPostCommentCollectionGqlNode: GraphQLObjectType<IBlogPostCommentCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostCommentCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(BlogPostCommentGqlNode)),
      resolve: (parent, args, ctx): OrNull<IBlogPostCommentGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(BlogPostCommentCollectionGqlActions),
      resolve: (parent, args, ctx): IBlogPostCommentCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
