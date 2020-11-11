import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NewsArticleModel, PermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IPermissionCollectionGqlNodeSource, PermissionCollectionGqlNode } from "./permission.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "./permission.collection.gql.options";

export const PermissionGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  permissions: {
    type: GraphQLNonNull(PermissionCollectionGqlNode),
    args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IPermissionCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.permissionPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.permissionRepository.findAllAndCount({
        runner: null,
        options: { ...options, },
      });
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
});