import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NewsArticleLang } from "../news-article.lang";
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from "./news-article.collection.gql.node";
import { NewsArticleCollectionOptionsGqlInput } from "./news-article.collection.gql.options";

export const NewsArticlesGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  newsArticles: {
    type: GraphQLNonNull(NewsArticleCollectionGqlNode),
    args: gqlQueryArg(NewsArticleCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INewsArticleCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.newsArticlePolicy.canAccess(), NewsArticleLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.newsArticlePolicy.canFindMany(), NewsArticleLang.CannotFindMany);
      // find
      const collection = ctx.services.newsArticleRepository.gqlCollection({
        args,
        runner: null,
      });
      return collection;
    },
  },
});