import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { RolePermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { RolePermissionCollectionGqlNode, IRolePermissionCollectionGqlNodeSource } from "./role-permission.collection.gql.node";
import { RolePermissionCollectionOptionsGqlInput } from "./role-permission.collection.gql.options";

export const RolePermissionGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  rolePermissions: {
    type: GraphQLNonNull(RolePermissionCollectionGqlNode),
    args: gqlQueryArg(RolePermissionCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IRolePermissionCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.rolePermissionPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.rolePermissionRepository.findAllAndCount({
        runner: null,
        options: { ...options, },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: IRolePermissionCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<RolePermissionModel> =>
          ctx.services.rolePermissionPolicy.canFindOne({ model })
            ? model
            : null,
        ),
        pagination,
      };
      return connection;
    },
  },
});