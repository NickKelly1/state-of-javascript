import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { PermissionModel } from "../permission.model";
import { IPermissionGqlNodeSource, PermissionGqlNode } from "./permission.gql.node";
import { IPermissionCollectionGqlActionSource, PermissionCollectionGqlActions } from "./permission.collection.gql.actions";


export interface IPermissionCollectionGqlNodeSource {
  models: OrNull<PermissionModel>[];
  pagination: ICollectionMeta;
}
export const PermissionCollectionGqlNode: GraphQLObjectType<IPermissionCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'PermissionCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(PermissionGqlNode)),
      resolve: (parent, args, ctx): OrNull<IPermissionGqlNodeSource>[] => parent.models,
    },
    actions: {
      type: GraphQLNonNull(PermissionCollectionGqlActions),
      resolve: (parent, args, ctx): IPermissionCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
