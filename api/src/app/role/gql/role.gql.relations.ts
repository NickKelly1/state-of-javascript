import { RoleModel } from "../../../circle";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { Op } from "sequelize";
import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { IUserRoleCollectionGqlNodeSource, UserRoleCollectionGqlNode } from "../../user-role/gql/user-role.collection.gql.node";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { UserRoleCollectionOptionsGqlInput } from "../../user-role/gql/user-role.collection.gql.options";
import { IRolePermissionCollectionGqlNodeSource, RolePermissionCollectionGqlNode } from "../../role-permission/gql/role-permission.collection.gql.node";
import { RolePermissionCollectionOptionsGqlInput } from "../../role-permission/gql/role-permission.collection.gql.options";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { GqlContext } from "../../../common/context/gql.context";
import { PermissionAssociation } from "../../permission/permission.associations";
import { RoleField } from "../role.attributes";
import { PermissionCollectionGqlNode, IPermissionCollectionGqlNodeSource } from "../../permission/gql/permission.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "../../permission/gql/permission.collection.gql.options";
import { UserCollectionGqlNode, IUserCollectionGqlNodeSource } from "../../user/gql/user.collection.gql.node";
import { UserAssociation } from "../../user/user.associations";
import { UserCollectionOptionsGqlInput } from "../../user/gql/user.collection.gql.options";

export type IRoleGqlRelationsSource = RoleModel;
export const RoleGqlRelations = new GraphQLObjectType<IRoleGqlRelationsSource, GqlContext>({
  name: 'RoleRelations',
  fields: () => ({
    userRoles: {
      type: GraphQLNonNull(UserRoleCollectionGqlNode),
      args: gqlQueryArg(UserRoleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IUserRoleCollectionGqlNodeSource> => {
        const collection = await ctx.services.userRoleRepository.gqlCollection({
          args,
          runner: null,
          where: { [UserRoleField.user_id]: { [Op.eq]: parent.id }, },
        });
        return collection;
      },
    },


    rolePermissions: {
      type: GraphQLNonNull(RolePermissionCollectionGqlNode),
      args: gqlQueryArg(RolePermissionCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IRolePermissionCollectionGqlNodeSource> => {
        const collection = await ctx.services.rolePermissionRepository.gqlCollection({
          args,
          runner: null,
          where: { [RolePermissionField.role_id]: { [Op.eq]: parent.id } },
        });
        return collection;
      },
    },

    permissions: {
      type: GraphQLNonNull(PermissionCollectionGqlNode),
      args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IPermissionCollectionGqlNodeSource> => {
        const collection = await ctx.services.permissionRepository.gqlCollection({
          args,
          runner: null,
          include: [
            { association: PermissionAssociation.category, },
            {
              association: PermissionAssociation.roles,
              where: { [RoleField.id]: { [Op.eq]: parent.id }, },
            },
          ],
        });
        return collection;
      },
    },

    users: {
      type: GraphQLNonNull(UserCollectionGqlNode),
      args: gqlQueryArg(UserCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IUserCollectionGqlNodeSource> => {
        const collection = await ctx.services.userRepository.gqlCollection({
          args,
          runner: null,
          include: [{
            association: UserAssociation.roles,
            where: { [RoleField.id]: { [Op.eq]: parent.id }, },
          }],
        });
        return collection;
      },
    },
  }),
});