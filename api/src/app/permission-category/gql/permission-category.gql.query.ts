import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { PermissionCategoryModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { PermissionCategoryCollectionGqlNode, IPermissionCategoryCollectionGqlNodeSource } from "./permission-category.collection.gql.node";
import { PermissionCategoryCollectionOptionsGqlInput } from "./permission-category.collection.gql.options";


export const PermissionCategoryGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Get PermissionCategorys
   */
  permissionCategoryies: {
    type: GraphQLNonNull(PermissionCategoryCollectionGqlNode),
    args: gqlQueryArg(PermissionCategoryCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IPermissionCategoryCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.permissionCategoryPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.permissionCategoryRepository.findAllAndCount({
        runner: null,
        options: { ...options, },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: IPermissionCategoryCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<PermissionCategoryModel> =>
          ctx.services.permissionCategoryPolicy.canFindOne({ model })
            ? model
            : null
        ),
        pagination,
      };
      return connection;
    },
  },
});