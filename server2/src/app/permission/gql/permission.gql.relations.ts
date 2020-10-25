import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { PermissionModel, RolePermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IRolePermissionCollectionGqlNodeSource, RolePermissionCollectionGqlNode } from "../../role-permission/gql/role-permission.collection.gql.node";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { GqlPermissionQuery } from "./permission.gql.query";

export type IPermissionGqlRelationsSource = PermissionModel;
export const PermissionGqlRelations = new GraphQLObjectType<IPermissionGqlRelationsSource, GqlContext>({
  name: 'PermissionRelations',
  fields: () => ({
    rolePermissions: {
      type: GraphQLNonNull(RolePermissionCollectionGqlNode),
      args: gqlQueryArg(GqlPermissionQuery),
      resolve: async (parent, args, ctx): Promise<IRolePermissionCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.rolePermissionRepository().findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([
              options.where,
              { [RolePermissionField.permission_id]: { [Op.eq]: parent.id } },
            ]),
          }
        });
        const pagination = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionCollectionGqlNodeSource = {
          models: rows.map((model): OrNull<RolePermissionModel> =>
            ctx.services.rolePermissionPolicy().canFindOne({ model })
              ? model
              : null
          ),
          pagination,
        };
        return connection;
      },
    },
  }),
});
