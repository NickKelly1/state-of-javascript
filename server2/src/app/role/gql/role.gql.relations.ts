import { PermissionModel, RoleModel, UserModel, UserRoleModel } from "../../../circle";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { Op } from "sequelize";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserRoleCollectionGqlNodeSource, UserRoleCollectionGqlNode } from "../../user-role/gql/user-role.collection.gql.node";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { UserRoleCollectionOptionsGqlInput } from "../../user-role/gql/user-role.collection.gql.options";
import { IRolePermissionCollectionGqlNodeSource, RolePermissionCollectionGqlNode } from "../../role-permission/gql/role-permission.collection.gql.node";
import { RolePermissionCollectionOptionsGqlInput } from "../../role-permission/gql/role-permission.collection.gql.options";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { RolePermissionModel } from "../../role-permission/role-permission.model";
import { GqlContext } from "../../../common/context/gql.context";
import { PermissionAssociation } from "../../permission/permission.associations";
import { RoleField } from "../role.attributes";
import { PermissionCollectionGqlNode, IPermissionCollectionGqlNodeSource } from "../../permission/gql/permission.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "../../permission/gql/permission.collection.gql.options";
import { UserCollectionGqlNode, IUserCollectionGqlNodeSource } from "../../user/gql/user.collection.gql.node";
import { UserAssociation } from "../../user/user.associations";
import { UserCollectionOptionsGqlInput } from "../../user/gql/user.collection.gql.options";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { UserRoleAssociation } from "../../user-role/user-role.associations";
import { RolePermissionAssociation } from "../../role-permission/role-permission.associations";

export type IRoleGqlRelationsSource = RoleModel;
export const RoleGqlRelations = new GraphQLObjectType<IRoleGqlRelationsSource, GqlContext>({
  name: 'RoleRelations',
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
            include: [{ association: UserRoleAssociation.user, }],
            where: andWhere([
              options.where,
              { [UserRoleField.user_id]: { [Op.eq]: parent.id } }
            ]),
          },
        });
        // prime users
        rows.forEach(row => {
          const user = assertDefined(row.user);
          ctx.loader.users.prime(user.id, user);
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: IUserRoleCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<UserRoleModel> =>
            ctx.services.userRolePolicy.canFindOne({
              model,
              role: parent,
              user: assertDefined(model.user),
            })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },


    rolePermissions: {
      type: GraphQLNonNull(RolePermissionCollectionGqlNode),
      args: gqlQueryArg(RolePermissionCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IRolePermissionCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.rolePermissionRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            include: [{ association: RolePermissionAssociation.permission, }],
            where: andWhere([
              options.where,
              { [RolePermissionField.role_id]: { [Op.eq]: parent.id } },
            ]),
          },
        });
        // prime permissions
        rows.forEach(row => {
          const permission = assertDefined(row.permission);
          ctx.loader.permissions.prime(permission.id, permission);
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<RolePermissionModel> =>
            ctx.services.rolePermissionPolicy.canFindOne({
              model,
              permission: assertDefined(model.permission),
              role: parent,
            })
              ? model
              : null
          ),
          pagination,
        };
        return connection;
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
            include: [
              { association: PermissionAssociation.category, },
              {
                association: PermissionAssociation.roles,
                where: { [RoleField.id]: { [Op.eq]: parent.id }, },
              },
          ]
          },
        });

        // eager load categories too...
        rows
          .map(row => assertDefined(row.category))
          .forEach(category => ctx.loader.permissionCategories.prime(category.id, category))

        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IPermissionCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<PermissionModel> =>
            ctx.services.permissionPolicy.canFindOne({ model })
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
      args: gqlQueryArg(UserCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IUserCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.userRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([ options.where, ]),
            include: [{
              association: UserAssociation.roles,
              where: { [RoleField.id]: { [Op.eq]: parent.id }, },
            }]
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IUserCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<UserModel> =>
            ctx.services.userPolicy.canFindOne({ model })
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