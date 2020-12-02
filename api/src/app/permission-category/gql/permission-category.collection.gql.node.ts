import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { PermissionCategoryModel } from "../../../circle";
import { PermissionCategoryCollectionGqlActions, IPermissionCategoryCollectionGqlActionSource } from "./permission-category.collection.gql.actions";
import { PermissionCategoryGqlNode, IPermissionCategoryGqlNodeSource } from "./permission-category.gql.node";


export interface IPermissionCategoryCollectionGqlNodeSource {
  models: OrNull<PermissionCategoryModel>[];
  pagination: ICollectionMeta;
}
export const PermissionCategoryCollectionGqlNode: GraphQLObjectType<IPermissionCategoryCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'PermissionCategoryCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(PermissionCategoryGqlNode)),
      resolve: (parent, args, ctx): OrNull<IPermissionCategoryGqlNodeSource>[] => parent.models,
    },
    actions: {
      type: GraphQLNonNull(PermissionCategoryCollectionGqlActions),
      resolve: (parent, args, ctx): IPermissionCategoryCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
