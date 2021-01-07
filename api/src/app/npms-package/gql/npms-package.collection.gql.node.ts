import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlPagination, IGqlMetaSource } from "../../../common/gql/gql.pagination";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { INpmsPackageGqlNodeSource, NpmsPackageGqlNode } from "./npms-package.gql.node";
import { INpmsPackageCollectionGqlActionSource, NpmsPackageCollectionGqlActions } from "./npms-package.collection.gql.actions";
import { NpmsPackageModel } from "../npms-package.model";


export interface INpmsPackageCollectionGqlNodeSource {
  models: OrNull<NpmsPackageModel>[];
  pagination: ICollectionMeta;
}
export const NpmsPackageCollectionGqlNode: GraphQLObjectType<INpmsPackageCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsPackageCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(NpmsPackageGqlNode)),
      resolve: (parent, args, ctx): OrNull<INpmsPackageGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(NpmsPackageCollectionGqlActions),
      resolve: (parent, args, ctx): INpmsPackageCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlPagination),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
