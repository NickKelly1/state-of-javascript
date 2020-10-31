import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NewsArticleModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from "./news-article.collection.gql.node";
import { NewsArticleCollectionOptionsGqlInput } from "./news-article.collection.gql.options";

export const NewsArticlesGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  newsArticles: {
    type: GraphQLNonNull(NewsArticleCollectionGqlNode),
    args: gqlQueryArg(NewsArticleCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INewsArticleCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.userPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.newsArticleRepository.findAllAndCount({
        runner: null,
        options: { ...options },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: INewsArticleCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<NewsArticleModel> =>
          ctx.services.newsArticlePolicy.canFindOne({ model })
            ? model
            : null
          ),
        pagination,
      };
      return connection;
    },
  },
});