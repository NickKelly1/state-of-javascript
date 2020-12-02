import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { RolePermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { RolePermissionAssociation } from "../role-permission.associations";
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
        options: {
          include: [
            { association: RolePermissionAssociation.permission, },
            { association: RolePermissionAssociation.role, },
          ],
          ...options,
        },
      });
      // prime roles
      rows.map(row => {
        const role = assertDefined(row.role);
        ctx.loader.roles.prime(role.id, role);
      });
      // prime permissions
      rows.map(row => {
        const permission = assertDefined(row.permission);
        ctx.loader.permissions.prime(permission.id, permission);
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: IRolePermissionCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<RolePermissionModel> =>
          ctx.services.rolePermissionPolicy.canFindOne({
            model,
            role: assertDefined(model.role),
            permission: assertDefined(model.permission),
          })
            ? model
            : null,
        ),
        pagination,
      };
      return connection;
    },
  },
});