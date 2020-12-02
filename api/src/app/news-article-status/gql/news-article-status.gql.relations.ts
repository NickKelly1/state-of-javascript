import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NewsArticleStatusModel } from "../news-article-status.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from "../../news-article/gql/news-article.collection.gql.node";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NewsArticleCollectionOptionsGqlInput } from "../../news-article/gql/news-article.collection.gql.options";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { NewsArticleField } from "../../news-article/news-article.attributes";
import { Op } from "sequelize";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { NewsArticleModel } from "../../../circle";


export type INewsArticleStatusGqlRelationsSource = NewsArticleStatusModel;
export const NewsArticleStatusGqlRelations: GraphQLObjectType<INewsArticleStatusGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleStatusRelations',
  fields: () => ({
    newsArticles: {
      type: GraphQLNonNull(NewsArticleCollectionGqlNode),
      args: gqlQueryArg(NewsArticleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INewsArticleCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.newsArticleRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              // TODO...
              { [NewsArticleField.status_id]: { [Op.eq]: parent.id } }
            ]),
          },
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
  }),
});
