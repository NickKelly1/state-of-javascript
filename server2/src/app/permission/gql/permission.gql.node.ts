import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Op } from "sequelize";
import { PermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IRolePermissionGqlConnection, RolePermissionGqlConnection } from "../../role-permission/gql/role-permission.gql.connection";
import { IRolePermissionGqlEdge } from "../../role-permission/gql/role-permission.gql.edge";
import { RolePermissionField } from "../../role-permission/role-permission.attributes";
import { GqlPermissionQuery } from "./permission.gql.query";

export type IPermissionGqlNode = PermissionModel;
export const PermissionGqlNode = new GraphQLObjectType<IPermissionGqlNode, GqlContext>({
  name: 'Permission',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
    ...SoftDeleteableGql,

    rolePermissionConnection: {
      type: GraphQLNonNull(RolePermissionGqlConnection),
      args: gqlQueryArg(GqlPermissionQuery),
      resolve: async (parent, args, ctx): Promise<IRolePermissionGqlConnection> => {
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
        const meta = collectionMeta({ data: rows, total: count, page });
        const connection: IRolePermissionGqlConnection = {
          edges: rows.map((model): OrNull<IRolePermissionGqlEdge> =>
            ctx.services.rolePermissionPolicy().canFindOne({ model })
              ? ({ cursor: model.id.toString(), node: model, })
              : null
          ),
          meta,
        };
        return connection;
      },
    },
  }),
});
