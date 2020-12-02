import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { PermissionModel, RoleModel, RolePermissionModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IPermissionCategoryGqlNodeSource, PermissionCategoryGqlNode } from "../../permission-category/gql/permission-category.gql.node";
import { IRolePermissionCollectionGqlNodeSource, RolePermissionCollectionGqlNode } from "../../role-permission/gql/role-permission.collection.gql.node";
import { RolePermissionAssociation } from "../../role-permission/role-permission.associations";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { RoleCollectionGqlNode, IRoleCollectionGqlNodeSource } from "../../role/gql/role.collection.gql.node";
import { RoleCollectionOptionsGqlInput } from "../../role/gql/role.collection.gql.options";
import { RoleAssociation } from "../../role/role.associations";
import { UserCollectionGqlNode, IUserCollectionGqlNodeSource } from "../../user/gql/user.collection.gql.node";
import { UserCollectionOptionsGqlInput } from "../../user/gql/user.collection.gql.options";
import { UserAssociation } from "../../user/user.associations";
import { UserField } from "../../user/user.attributes";
import { PermissionAssociation } from "../permission.associations";
import { PermissionField } from "../permission.attributes";
import { PermissionCollectionOptionsGqlInput } from "./permission.collection.gql.options";

export type IPermissionGqlRelationsSource = PermissionModel;
export const PermissionGqlRelations = new GraphQLObjectType<IPermissionGqlRelationsSource, GqlContext>({
  name: 'PermissionRelations',
  fields: () => ({
    category: {
      type: PermissionCategoryGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IPermissionCategoryGqlNodeSource>> => {
        const category = await ctx.loader.permissionCategories.load(parent.category_id);
        if (!category) return null;
        if (!ctx.services.permissionCategoryPolicy.canFindOne({ model: category })) return null;
        return category;
      },
    },

    rolePermissions: {
      type: GraphQLNonNull(RolePermissionCollectionGqlNode),
      args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IRolePermissionCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.rolePermissionRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            include: [{ association: RolePermissionAssociation.role, }],
            where: andWhere([
              options.where,
              { [RolePermissionField.permission_id]: { [Op.eq]: parent.id } },
            ]),
          }
        });
        // prime roles
        rows.forEach(row => {
          const role = assertDefined(row.role);
          ctx.loader.roles.prime(role.id, role);
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<RolePermissionModel> =>
            ctx.services.rolePermissionPolicy.canFindOne({
              model,
              permission: parent,
              role: assertDefined(model.role),
            })
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
              include: [{
                association: RoleAssociation.permissions,
                where: { [PermissionField.id]: { [Op.eq]: parent.id } },
              }],
            }],
          },
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const collection: IUserCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<UserModel> =>
            ctx.services.userPolicy.canFindOne({ model })
              ? model
              : null,
          ),
          pagination,
        };
        return collection;
      },
    },
  }),
});
