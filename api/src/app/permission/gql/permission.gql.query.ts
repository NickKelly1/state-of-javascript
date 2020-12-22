import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { PermissionLang } from "../permission.lang";
import { IPermissionCollectionGqlNodeSource, PermissionCollectionGqlNode } from "./permission.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "./permission.collection.gql.options";
import { SystemPermissionGqlNode, ISystemPermissionGqlNodeSource } from "./system-permissions.gql.node";


export const PermissionGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Get Permissions
   */
  permissions: {
    type: GraphQLNonNull(PermissionCollectionGqlNode),
    args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IPermissionCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.permissionPolicy.canAccess(), PermissionLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.permissionPolicy.canFindMany(), PermissionLang.CannotFindMany);
      // find
      const collection = await ctx.services.permissionRepository.gqlCollection({
        args,
        runner: null,
        where: null,
      });
      return collection;
    },
  },


  /**
   * Get System Permissions
   */
  systemPermissions: {
    type: GraphQLNonNull(SystemPermissionGqlNode),
    resolve: async (parent, args, ctx): Promise<ISystemPermissionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.permissionPolicy.canAccess(), PermissionLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.permissionPolicy.canFindMany(), PermissionLang.CannotFindMany);
      // find
      const systemPermissions = ctx
        .services
        .universal
        .systemPermissionsService
        .getPermissions();
      return systemPermissions;
    },
  },
});