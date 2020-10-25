import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLFieldConfigArgumentMap,
} from 'graphql';
import { Op, Rangable, WhereAttributeHash, WhereOptions } from 'sequelize';
import { logger } from './common/logger/logger';
import { prettyQ } from './common/helpers/pretty.helper';
import { GqlContext } from './common/classes/gql.context';
import { OrUndefined } from './common/types/or-undefined.type';
import { transformGqlQuery } from './common/gql/gql.query.transform';
import { collectionMeta } from './common/responses/collection-meta';
import { gqlQueryArg } from './common/gql/gql.query.arg';
import { GqlUserQuery } from './app/user/gql/user.gql.query';
import { UserRoleGqlQuery } from './app/user-role/gql/user-role.gql.query';
import { GqlRoleQuery } from './app/role/gql/role.gql.query';
import { RolePermissionGqlQuery } from './app/role-permission/gql/role-permission.gql.query';
import { OrNull } from './common/types/or-null.type';
import { GqlNewsArticleQuery } from './app/news-article/gql/news-article.gql.query';
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from './app/news-article/gql/news-article.collection.gql.node';
import { NewsArticleModel } from './app/news-article/news-article.model';
import { IUserCollectionGqlNodeSource, UserCollectionGqlNode } from './app/user/gql/user.collection.gql.node';
import { IRoleCollectionGqlNodeSource, RoleCollectionGqlNode } from './app/role/gql/role.collection.gql.node';
import { IRolePermissionCollectionGqlNodeSource, RolePermissionCollectionGqlNode } from './app/role-permission/gql/role-permission.collection.gql.node';
import { RolePermissionModel } from './app/role-permission/role-permission.model';
import { RoleModel } from './app/role/role.model';
import { UserModel } from './app/user/user.model';
import { IUserRoleCollectionGqlNodeSource, UserRoleCollectionGqlNode } from './app/user-role/gql/user-role.collection.gql.node';
import { UserRoleModel } from './app/user-role/user-role.model';


export const GqlRootQuery = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootQueryType',
  fields: () => ({
    newsArticles: {
      type: GraphQLNonNull(NewsArticleCollectionGqlNode),
      args: gqlQueryArg(GqlNewsArticleQuery),
      resolve: async (parent, args, ctx): Promise<INewsArticleCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.userPolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.newsArticleRepository().findAllAndCount({
          runner: null,
          options: { ...options },
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

    users: {
      type: GraphQLNonNull(UserCollectionGqlNode),
      args: gqlQueryArg(GqlUserQuery),
      resolve: async (parent, args, ctx): Promise<IUserCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.userPolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRepository().findAllAndCount({
          runner: null,
          options: { ...options },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IUserCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<UserModel> =>
            ctx.services.userPolicy().canFindOne({ model })
              ? model
              : null
            ),
          pagination,
        };
        return connection;
      },
    },

    userRoles: {
      type: GraphQLNonNull(UserRoleCollectionGqlNode),
      args: gqlQueryArg(UserRoleGqlQuery),
      resolve: async (parent, args, ctx): Promise<IUserRoleCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.userPolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRoleRepository().findAllAndCount({
          runner: null,
          options: { ...options, },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IUserRoleCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<UserRoleModel> =>
            ctx.services.userRolePolicy().canFindOne({ model })
              ? model
              : null
          ),
          pagination,
        };
        return connection;
      },
    },

    roles: {
      type: GraphQLNonNull(RoleCollectionGqlNode),
      args: gqlQueryArg(GqlRoleQuery),
      resolve: async (parent, args, ctx): Promise<IRoleCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.rolePolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.roleRepository().findAllAndCount({
          runner: null,
          options: { ...options, },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IRoleCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<RoleModel> =>
            ctx.services.rolePolicy().canFindOne({ model })
              ? model
              : null
          ),
          pagination,
        };
        return connection;
      },
    },

    rolePermissions: {
      type: GraphQLNonNull(RolePermissionCollectionGqlNode),
      args: gqlQueryArg(RolePermissionGqlQuery),
      resolve: async (parent, args, ctx): Promise<IRolePermissionCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.rolePermissionPolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.rolePermissionRepository().findAllAndCount({
          runner: null,
          options: { ...options, },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<RolePermissionModel> =>
            ctx.services.rolePermissionPolicy().canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return connection;
      },
    },
  }),
});
