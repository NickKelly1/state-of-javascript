import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Op } from "sequelize";
import { PermissionCategoryModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { PermissionCollectionGqlNode, IPermissionCollectionGqlNodeSource } from "../../permission/gql/permission.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "../../permission/gql/permission.collection.gql.options";
import { PermissionField } from "../../permission/permission.attributes";

export type IPermissionCategoryGqlRelationsSource = PermissionCategoryModel;
export const PermissionCategoryGqlRelations = new GraphQLObjectType<IPermissionCategoryGqlRelationsSource, GqlContext>({
  name: 'PermissionCategoryRelations',
  fields: () => ({
    permissions: {
      type: GraphQLNonNull(PermissionCollectionGqlNode),
      args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IPermissionCollectionGqlNodeSource> => {
        const collection = ctx.services.permissionRepository.gqlCollection({
          runner: null,
          args,
          where: { [PermissionField.category_id]: { [Op.eq]: parent.id, }, },
        });
        return collection;
      },
    },
  }),
});
