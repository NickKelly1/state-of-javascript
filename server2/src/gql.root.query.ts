import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLFieldConfigArgumentMap,
} from 'graphql';
import { Op, Rangable, WhereAttributeHash, WhereOptions } from 'sequelize';
import { logger } from './common/logger/logger';
import { prettyQ } from './common/helpers/pretty.helper';
import { IUserRoleGqlConnection, UserRoleGqlConnection } from './app/user-role/gql/user-role.gql.connection';
import { GqlContext } from './common/classes/gql.context';
import { OrUndefined } from './common/types/or-undefined.type';
import { IUserGqlConnection, UserGqlConnection } from './app/user/gql/user.gql.connection';
import { transformGqlQuery } from './common/gql/gql.query.transform';
import { collectionMeta } from './common/responses/collection-meta';
import { IUserGqlEdge } from './app/user/gql/user.gql.edge';
import { IRolePermissionGqlConnection, RolePermissionGqlConnection } from './app/role-permission/gql/role-permission.gql.connection';
import { IRolePermissionGqlEdge } from './app/role-permission/gql/role-permission.gql.edge';
import { IRoleGqlConnection, RoleGqlConnection } from './app/role/gql/role.gql.connection';
import { IRoleGqlEdge } from './app/role/gql/role.gql.edge';
import { IUserRoleGqlEdge } from './app/user-role/gql/user-role.gql.edge';
import { gqlQueryArg } from './common/gql/gql.query.arg';
import { GqlUserQuery } from './app/user/gql/user.gql.query';
import { GqlUserRoleQuery } from './app/user-role/gql/user-role.gql.query';
import { GqlRoleQuery } from './app/role/gql/role.gql.query';
import { GqlRolePermissionQuery } from './app/role-permission/gql/role-permission.gql.query';
import { OrNull } from './common/types/or-null.type';


export const GqlRootQuery = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootQueryType',
  fields: () => ({
    users: {
      type: GraphQLNonNull(UserGqlConnection),
      args: gqlQueryArg(GqlUserQuery),
      resolve: async (parent, args, ctx): Promise<IUserGqlConnection> => {
        ctx.authorize(ctx.services.userPolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRepository().findAllAndCount({
          runner: null,
          options: { ...options },
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IUserGqlConnection = {
          edges: rows.map((model): OrNull<IUserGqlEdge> =>
            ctx.services.userPolicy().canFindOne({ model })
              ? ({ cursor: model.id.toString(), node: model, })
              : null
            ),
          meta,
        };
        return connection;
      },
    },

    userRoles: {
      type: GraphQLNonNull(UserRoleGqlConnection),
      args: gqlQueryArg(GqlUserRoleQuery),
      resolve: async (parent, args, ctx): Promise<IUserRoleGqlConnection> => {
        ctx.authorize(ctx.services.userPolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRoleRepository().findAllAndCount({
          runner: null,
          options: { ...options, },
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

    roles: {
      type: GraphQLNonNull(RoleGqlConnection),
      args: gqlQueryArg(GqlRoleQuery),
      resolve: async (parent, args, ctx): Promise<IRoleGqlConnection> => {
        ctx.authorize(ctx.services.rolePolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.roleRepository().findAllAndCount({
          runner: null,
          options: { ...options, },
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IRoleGqlConnection = {
          edges: rows.map((model): OrNull<IRoleGqlEdge> =>
            ctx.services.rolePolicy().canFindOne({ model })
              ? ({ cursor: model.id.toString(), node: model, })
              : null
          ),
          meta,
        };
        return connection;
      },
    },

    rolePermissions: {
      type: GraphQLNonNull(RolePermissionGqlConnection),
      args: gqlQueryArg(GqlRolePermissionQuery),
      resolve: async (parent, args, ctx): Promise<IRolePermissionGqlConnection> => {
        ctx.authorize(ctx.services.rolePermissionPolicy().canFindMany());
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.rolePermissionRepository().findAllAndCount({
          runner: null,
          options: { ...options, },
        });
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionGqlConnection = {
          edges: rows.map((model): OrNull<IRolePermissionGqlEdge> =>
            ctx.services.rolePermissionPolicy().canFindOne({ model })
              ? ({ cursor: model.id.toString(), node: model, })
              : null,
          ),
          meta,
        };
        return connection;
      },
    },
  }),
});
