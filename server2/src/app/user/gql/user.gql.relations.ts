import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { UserRoleCollectionOptionsGqlInput } from "../../user-role/gql/user-role.collection.gql.options";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { Op } from "sequelize";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { NewsArticleCollectionOptionsGqlInput } from "../../news-article/gql/news-article.collection.gql.options";
import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserModel } from "../user.model";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserRoleCollectionGqlNodeSource, UserRoleCollectionGqlNode } from "../../user-role/gql/user-role.collection.gql.node";
import { UserRoleModel } from "../../user-role/user-role.model";
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from "../../news-article/gql/news-article.collection.gql.node";
import { NewsArticleModel } from "../../news-article/news-article.model";
import { NewsArticleField } from "../../news-article/news-article.attributes";
import { GqlContext } from "../../../common/context/gql.context";
import { IRoleCollectionGqlNodeSource, RoleCollectionGqlNode } from "../../role/gql/role.collection.gql.node";
import { RoleCollectionOptionsGqlInput } from "../../role/gql/role.collection.gql.options";
import { RoleAssociation } from "../../role/role.associations";
import { RoleField } from "../../role/role.attributes";
import { UserField } from "../user.attributes";
import { PermissionModel, RoleModel } from "../../../circle";
import { PermissionCollectionGqlNode, IPermissionCollectionGqlNodeSource } from "../../permission/gql/permission.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "../../permission/gql/permission.collection.gql.options";
import { PermissionAssociation } from "../../permission/permission.associations";

export type IUserGqlRelationsSource = UserModel;
export const UserGqlRelations = new GraphQLObjectType<IUserGqlRelationsSource, GqlContext>({
  name: 'UserRelations',
  fields: () => ({
    userRoles: {
      type: GraphQLNonNull(UserRoleCollectionGqlNode),
      args: gqlQueryArg(UserRoleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IUserRoleCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRoleRepository.findAllAndCount({
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
            ctx.services.userRolePolicy.canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },

    roles: {
      type: GraphQLNonNull(RoleCollectionGqlNode),
      args: gqlQueryArg(RoleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IRoleCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.roleRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([ options.where, ]),
            include: [{
              association: RoleAssociation.users,
              where: { [UserField.id]: { [Op.eq]: parent.id } },
            }]
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: IRoleCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<RoleModel> =>
            ctx.services.rolePolicy.canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },

    permissions: {
      type: GraphQLNonNull(PermissionCollectionGqlNode),
      args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IPermissionCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.permissionRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([ options.where, ]),
            include: [{
              association: PermissionAssociation.roles,
              include: [{
                association: RoleAssociation.users,
                where: { [UserField.id]: { [Op.eq]: parent.id } },
              }],
            }],
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: IPermissionCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<PermissionModel> =>
            ctx.services.permissionPolicy.canFindOne({ model })
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
      args: gqlQueryArg(NewsArticleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INewsArticleCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.newsArticleRepository.findAllAndCount({
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