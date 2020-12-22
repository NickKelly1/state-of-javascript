import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NewsArticleStatusLang } from "../news-article-status.lang";
import { INewsArticleStatusCollectionGqlNodeSource, NewsArticleStatusCollectionGqlNode } from "./news-article-status.collection.gql.node";
import { NewsArticleStatusCollectionOptionsGqlInput } from "./news-article-status.collection.gql.options";

export const NewsArticleStatusGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  newsArticleStatuses: {
    type: GraphQLNonNull(NewsArticleStatusCollectionGqlNode),
    args: gqlQueryArg(NewsArticleStatusCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INewsArticleStatusCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.newsArticleStatusPolicy.canAccess(), NewsArticleStatusLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.newsArticleStatusPolicy.canFindMany(), NewsArticleStatusLang.CannotFindMany);
      // find
      const collection = await ctx.services.newsArticleStatusRepository.gqlCollection({
        args,
        runner: null,
      });
      return collection;
    },
  },
});