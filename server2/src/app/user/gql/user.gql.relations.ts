import { GqlContext } from "../../../common/classes/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { UserRoleGqlQuery } from "../../user-role/gql/user-role.gql.query";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { Op } from "sequelize";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { GqlNewsArticleQuery } from "../../news-article/gql/news-article.gql.query";
import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserModel } from "../user.model";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserRoleCollectionGqlNodeSource, UserRoleCollectionGqlNode } from "../../user-role/gql/user-role.collection.gql.node";
import { UserRoleModel } from "../../user-role/user-role.model";
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from "../../news-article/gql/news-article.collection.gql.node";
import { NewsArticleModel } from "../../news-article/news-article.model";
import { NewsArticleField } from "../../news-article/news-article.attributes";

export type IUserGqlRelationsSource = UserModel;
export const UserGqlRelations = new GraphQLObjectType<IUserGqlRelationsSource, GqlContext>({
  name: 'UserRelations',
  fields: () => ({
    userRoles: {
      type: GraphQLNonNull(UserRoleCollectionGqlNode),
      args: gqlQueryArg(UserRoleGqlQuery),
      resolve: async (parent, args, ctx): Promise<IUserRoleCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRoleRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [UserRoleField.user_id]: { [Op.eq]: parent.id } }
            ]),
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: IUserRoleCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<UserRoleModel> =>
            ctx.services.userRolePolicy().canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },

    newsArticles: {
      type: GraphQLNonNull(NewsArticleCollectionGqlNode),
      args: gqlQueryArg(GqlNewsArticleQuery),
      resolve: async (parent, args, ctx): Promise<INewsArticleCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.newsArticleRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [NewsArticleField.author_id]: { [Op.eq]: parent.id } }
            ]),
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: INewsArticleCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<NewsArticleModel> =>
            ctx.services.newsArticlePolicy().canFindOne({ model })
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