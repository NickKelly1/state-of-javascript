import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { NewsArticleStatusModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { INewsArticleStatusGqlActionsSource, NewsArticleStatusGqlActions } from "./news-article-status.gql.actions";
import { INewsArticleStatusGqlRelationsSource, NewsArticleStatusGqlRelations } from "./news-article-status.gql.relations";
import { INewsArticleStatusGqlDataSource, NewsArticleStatusGqlData } from "./news-article-status.gql.data";

export type INewsArticleStatusGqlNodeSource = NewsArticleStatusModel;
export const NewsArticleStatusGqlNode: GraphQLObjectType<INewsArticleStatusGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleStatusNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `news_article_status_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(NewsArticleStatusGqlData),
      resolve: (parent): INewsArticleStatusGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(NewsArticleStatusGqlActions),
      resolve: (parent): INewsArticleStatusGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(NewsArticleStatusGqlRelations),
      resolve: function (parent): INewsArticleStatusGqlRelationsSource {
        return parent;
      },
    },
  }),
});