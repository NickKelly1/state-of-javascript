import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { PermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { PermissionAssociation } from "../permission.associations";
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
      ctx.authorize(ctx.services.permissionPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.permissionRepository.findAllAndCount({
        runner: null,
        options: {
          ...options,
          include: [{ association: PermissionAssociation.category }]
        },
      });

      // eager load categories too...
      rows.map(row => assertDefined(row.category)).forEach(category => ctx.loader.permissionCategories.prime(category.id, category))

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


  /**
   * Get System Permissions
   */
  systemPermissions: {
    type: GraphQLNonNull(SystemPermissionGqlNode),
    resolve: async (parent, args, ctx): Promise<ISystemPermissionGqlNodeSource> => {
      ctx.authorize(ctx.services.permissionPolicy.canFindMany());
      const systemPermissions = ctx.services.universal.systemPermissions.getPermissions();
      return systemPermissions;
    },
  },
});