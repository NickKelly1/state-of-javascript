import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { NewsArticleModel } from "../../../circle";
import { INewsArticleGqlNodeSource, NewsArticleGqlNode } from "./news-article.gql.node";
import { INewsArticleCollectionGqlActionSource, NewsArticleCollectionGqlActions } from "./news-article.collection.gql.actions";


export interface INewsArticleCollectionGqlNodeSource {
  models: OrNull<NewsArticleModel>[];
  pagination: ICollectionMeta;
}
export const NewsArticleCollectionGqlNode: GraphQLObjectType<INewsArticleCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(NewsArticleGqlNode)),
      resolve: (parent, args, ctx): OrNull<INewsArticleGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(NewsArticleCollectionGqlActions),
      resolve: (parent, args, ctx): INewsArticleCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
