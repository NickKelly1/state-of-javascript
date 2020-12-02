
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { PermissionCategoryModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { PermissionCategoryGqlActions, IPermissionCategoryGqlActionsSource } from "./permission-category.gql.actions";
import { PermissionCategoryGqlData, IPermissionCategoryGqlDataSource } from "./permission-category.gql.data";
import { PermissionCategoryGqlRelations, IPermissionCategoryGqlRelationsSource } from "./permission-category.gql.relations";

export type IPermissionCategoryGqlNodeSource = PermissionCategoryModel;
export const PermissionCategoryGqlNode: GraphQLObjectType<IPermissionCategoryGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'PermissionCategoryNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `permission_category_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(PermissionCategoryGqlData),
      resolve: (parent): IPermissionCategoryGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(PermissionCategoryGqlActions),
      resolve: (parent): IPermissionCategoryGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(PermissionCategoryGqlRelations),
      resolve: function (parent): IPermissionCategoryGqlRelationsSource {
        return parent;
      },
    },
  }),
});