import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { RolePermissionLang } from "../role-permission.lang";
import { RolePermissionCollectionGqlNode, IRolePermissionCollectionGqlNodeSource } from "./role-permission.collection.gql.node";
import { RolePermissionCollectionOptionsGqlInput } from "./role-permission.collection.gql.options";

export const RolePermissionGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  rolePermissions: {
    type: GraphQLNonNull(RolePermissionCollectionGqlNode),
    args: gqlQueryArg(RolePermissionCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IRolePermissionCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.rolePermissionPolicy.canAccess(), RolePermissionLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.rolePermissionPolicy.canFindMany(), RolePermissionLang.CannotFindMany);
      // find
      const collection = await ctx.services.rolePermissionRepository.gqlCollection({
        args,
        runner: null,
      })
      return collection;
    },
  },
});