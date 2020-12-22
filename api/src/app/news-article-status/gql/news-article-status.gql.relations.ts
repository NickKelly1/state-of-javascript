import { GraphQLNonNull, GraphQLObjectType, } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NewsArticleStatusModel } from "../news-article-status.model";
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from "../../news-article/gql/news-article.collection.gql.node";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NewsArticleCollectionOptionsGqlInput } from "../../news-article/gql/news-article.collection.gql.options";
import { NewsArticleField } from "../../news-article/news-article.attributes";
import { Op } from "sequelize";


export type INewsArticleStatusGqlRelationsSource = NewsArticleStatusModel;
export const NewsArticleStatusGqlRelations: GraphQLObjectType<INewsArticleStatusGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleStatusRelations',
  fields: () => ({
    newsArticles: {
      type: GraphQLNonNull(NewsArticleCollectionGqlNode),
      args: gqlQueryArg(NewsArticleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INewsArticleCollectionGqlNodeSource> => {
        const collection = await ctx.services.newsArticleRepository.gqlCollection({
          runner: null,
          args,
          where: { [NewsArticleField.status_id]: { [Op.eq]: parent.id } },
        });
        return collection;
      },
    },
  }),
});
