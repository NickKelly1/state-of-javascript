import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { PermissionCategoryCollectionGqlNode, IPermissionCategoryCollectionGqlNodeSource } from "./permission-category.collection.gql.node";
import { PermissionCategoryCollectionOptionsGqlInput } from "./permission-category.collection.gql.options";
import { PermissionCategoryLang } from '../permission-category.lang';


export const PermissionCategoryGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Get PermissionCategorys
   */
  permissionCategoryies: {
    type: GraphQLNonNull(PermissionCategoryCollectionGqlNode),
    args: gqlQueryArg(PermissionCategoryCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IPermissionCategoryCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.permissionCategoryPolicy.canAccess(), PermissionCategoryLang.CannotFindMany);
      // authorise find-many
      ctx.authorize(ctx.services.permissionCategoryPolicy.canFindMany(), PermissionCategoryLang.CannotFindMany);
      // find
      const collection = await ctx.services.permissionCategoryRepository.gqlCollection({
        runner: null,
        args,
      });
      return collection;
    },
  },
});