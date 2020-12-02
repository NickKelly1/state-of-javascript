import { GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { RolePermissionModel } from "../role-permission.model";
import { OrNull } from "../../../common/types/or-null.type";
import { IRoleGqlNodeSource, RoleGqlNode } from "../../role/gql/role.gql.node";
import { PermissionGqlData } from "../../permission/gql/permission.gql.data";
import { IPermissionGqlNodeSource, PermissionGqlNode } from "../../permission/gql/permission.gql.node";


export type IRolePermissionGqlRelationsSource = RolePermissionModel;
export const RolePermissionGqlRelations: GraphQLObjectType<RolePermissionModel, GqlContext> = new GraphQLObjectType({
  name: 'RolePermissionRelations',
  fields: () => ({
    role: {
      type: RoleGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IRoleGqlNodeSource>> => {
        const model: OrNull<IRoleGqlNodeSource> = await ctx.loader.roles.load(parent.role_id);
        if (!model) return null;
        if (!ctx.services.rolePolicy.canFindOne({ model })) return null;
        return model;
      },
    },

    permission: {
      type: PermissionGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IPermissionGqlNodeSource>> => {
        const model: OrNull<IPermissionGqlNodeSource> = await ctx.loader.permissions.load(parent.permission_id);
        if (!model) return null;
        if (!ctx.services.permissionPolicy.canFindOne({ model })) return null;
        return model;
      },
    },
  }),
});
