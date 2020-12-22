import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { PermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { OrNull } from "../../../common/types/or-null.type";
import { IPermissionCategoryGqlNodeSource, PermissionCategoryGqlNode } from "../../permission-category/gql/permission-category.gql.node";
import { IRolePermissionCollectionGqlNodeSource, RolePermissionCollectionGqlNode } from "../../role-permission/gql/role-permission.collection.gql.node";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { RoleCollectionGqlNode, IRoleCollectionGqlNodeSource } from "../../role/gql/role.collection.gql.node";
import { RoleCollectionOptionsGqlInput } from "../../role/gql/role.collection.gql.options";
import { RoleAssociation } from "../../role/role.associations";
import { UserCollectionGqlNode, IUserCollectionGqlNodeSource } from "../../user/gql/user.collection.gql.node";
import { UserCollectionOptionsGqlInput } from "../../user/gql/user.collection.gql.options";
import { UserAssociation } from "../../user/user.associations";
import { UserField } from "../../user/user.attributes";
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
        const collection = await ctx.services.rolePermissionRepository.gqlCollection({
          args,
          runner: null,
          where: { [RolePermissionField.permission_id]: { [Op.eq]: parent.id } },
        });
        return collection;
      },
    },

    roles: {
      type: GraphQLNonNull(RoleCollectionGqlNode),
      args: gqlQueryArg(RoleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IRoleCollectionGqlNodeSource> => {
        const collection = await ctx.services.roleRepository.gqlCollection({
          runner: null,
          args,
          include: [{
            association: RoleAssociation.users,
            where: { [UserField.id]: { [Op.eq]: parent.id } },
          }],
        });
        return collection;
      },
    },

    users: {
      type: GraphQLNonNull(UserCollectionGqlNode),
      args: gqlQueryArg(UserCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IUserCollectionGqlNodeSource> => {
        const collection = await ctx.services.userRepository.gqlCollection({
          runner: null,
          args,
          include: [{
            association: UserAssociation.roles,
            include: [{
              association: RoleAssociation.permissions,
              where: { [PermissionField.id]: { [Op.eq]: parent.id } },
            }],
          }],
        });
        return collection;
      },
    },
  }),
});
