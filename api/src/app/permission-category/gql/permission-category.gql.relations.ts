import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { PermissionCategoryModel, PermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { andWhere } from "../../../common/helpers/and-where.helper.ts";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { PermissionCollectionGqlNode, IPermissionCollectionGqlNodeSource } from "../../permission/gql/permission.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "../../permission/gql/permission.collection.gql.options";
import { PermissionAssociation } from "../../permission/permission.associations";
import { RoleField } from "../../role/role.attributes";
import { PermissionCategoryField } from "../permission-category.attributes";

export type IPermissionCategoryGqlRelationsSource = PermissionCategoryModel;
export const PermissionCategoryGqlRelations = new GraphQLObjectType<IPermissionCategoryGqlRelationsSource, GqlContext>({
  name: 'PermissionCategoryRelations',
  fields: () => ({
    permissions: {
      type: GraphQLNonNull(PermissionCollectionGqlNode),
      args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IPermissionCollectionGqlNodeSource> => {
        const { page, options } = transformGqlQuery(args);
        const { rows, count } = await ctx.services.permissionRepository.findAllAndCount({
          runner: null,
          options: {
            ...options,
            where: andWhere([ options.where, ]),
            include: [{
              association: PermissionAssociation.category,
              where: { [PermissionCategoryField.id]: { [Op.eq]: parent.id }, },
            }]
          },
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
  }),
});
