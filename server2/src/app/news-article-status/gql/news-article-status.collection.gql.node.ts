import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { NewsArticleStatusModel } from "../../../circle";
import { INewsArticleStatusGqlNodeSource, NewsArticleStatusGqlNode } from "./news-article-status.gql.node";
import { INewsArticleStatusCollectionGqlActionSource, NewsArticleStatusCollectionGqlActions } from "./news-article-status.collection.gql.actions";


export interface INewsArticleStatusCollectionGqlNodeSource {
  models: OrNull<NewsArticleStatusModel>[];
  pagination: ICollectionMeta;
}
export const NewsArticleStatusCollectionGqlNode: GraphQLObjectType<INewsArticleStatusCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleStatusCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(NewsArticleStatusGqlNode)),
      resolve: (parent, args, ctx): OrNull<INewsArticleStatusGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(NewsArticleStatusCollectionGqlActions),
      resolve: (parent, args, ctx): INewsArticleStatusCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
