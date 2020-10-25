
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { RolePermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IRolePermissionGqlNodeSource, RolePermissionGqlNode } from "./role-permission.gql.node";
import { IRolePermissionCollectionGqlActionSource, RolePermissionCollectionGqlActions } from "./role-permission.collection.gql.actions";
import { GqlNever } from "../../../common/gql/gql.ever";

export interface IRolePermissionCollectionGqlNodeSource {
  models: OrNull<RolePermissionModel>[];
  pagination: ICollectionMeta;
}
export const RolePermissionCollectionGqlNode: GraphQLObjectType<IRolePermissionCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'RolePermissionCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(RolePermissionGqlNode)),
      resolve: (parent, args, ctx): OrNull<IRolePermissionGqlNodeSource>[] => parent.models,
    },
    actions: {
      type: GraphQLNonNull(RolePermissionCollectionGqlActions),
      resolve: (parent, args, ctx): IRolePermissionCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
