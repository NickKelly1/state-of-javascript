import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { NewsArticleModel } from "../../../circle";
import { INewsArticleGqlActionsSource, NewsArticleGqlActions } from "./news-article.gql.actions";
import { INewsArticleGqlRelationsSource, NewsArticleGqlRelations } from "./news-article.gql.relations";
import { INewsArticleGqlDataSource, NewsArticleGqlData } from "./news-article.gql.data";
import { GqlContext } from "../../../common/context/gql.context";

export type INewsArticleGqlNodeSource = NewsArticleModel;
export const NewsArticleGqlNode: GraphQLObjectType<INewsArticleGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `news_article_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(NewsArticleGqlData),
      resolve: (parent): INewsArticleGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(NewsArticleGqlActions),
      resolve: (parent): INewsArticleGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(NewsArticleGqlRelations),
      resolve: function (parent): INewsArticleGqlRelationsSource {
        return parent;
      },
    },
  }),
});