import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Op } from "sequelize";
import { GqlContext } from "../../../common/classes/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { IUserRoleGqlConnection, UserRoleGqlConnection } from "../../user-role/gql/user-role.gql.connection";
import { IUserRoleGqlEdge } from "../../user-role/gql/user-role.gql.edge";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { UserModel } from "../user.model";
import { GqlUserRoleQuery } from "../../user-role/gql/user-role.gql.query";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { OrNull } from "../../../common/types/or-null.type";
import { INewsArticleGqlConnection, NewsArticleGqlConnection } from "../../news-article/gql/news-article.gql.connection";
import { INewsArticleGqlEdge } from "../../news-article/gql/news-article.gql.edge";
import { GqlNewsArticleQuery } from "../../news-article/gql/news-article.gql.query";


export type IUserGqlNode = UserModel;
export const UserGqlNode = new GraphQLObjectType<IUserGqlNode, GqlContext>({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
    ...SoftDeleteableGql,

    userRoleConnection: {
      type: GraphQLNonNull(UserRoleGqlConnection),
      args: gqlQueryArg(GqlUserRoleQuery),
      resolve: async (parent, args, ctx): Promise<IUserRoleGqlConnection> => {
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
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IUserRoleGqlConnection = {
          edges: rows.map((model): OrNull<IUserRoleGqlEdge> =>
            ctx.services.userRolePolicy().canFindOne({ model })
              ? ({ cursor: model.id.toString(), node: model, })
              : null
            ),
          meta,
        };
        return connection;
      },
    },

    newsArticleConnection: {
      type: GraphQLNonNull(NewsArticleGqlConnection),
      args: gqlQueryArg(GqlNewsArticleQuery),
      resolve: async (parent, args, ctx): Promise<INewsArticleGqlConnection> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.newsArticleRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [UserRoleField.user_id]: { [Op.eq]: parent.id } }
            ]),
          },
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: INewsArticleGqlConnection = {
          edges: rows.map((model): OrNull<INewsArticleGqlEdge> =>
            ctx.services.newsArticlePolicy().canFindOne({ model })
              ? ({ cursor: model.id.toString(), node: model, })
              : null
            ),
          meta,
        };
        return connection;
      },
    },
  }),
});
