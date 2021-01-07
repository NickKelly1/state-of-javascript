import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlPagination, IGqlMetaSource } from "../../../common/gql/gql.pagination";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { ImageModel } from "../../../circle";
import { IImageGqlNodeSource, ImageGqlNode } from "./image.gql.node";
import { IImageCollectionGqlActionSource, ImageCollectionGqlActions } from "./image.collection.gql.actions";


export interface IImageCollectionGqlNodeSource {
  models: OrNull<ImageModel>[];
  pagination: ICollectionMeta;
}
export const ImageCollectionGqlNode: GraphQLObjectType<IImageCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'ImageCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(ImageGqlNode)),
      resolve: (parent, args, ctx): OrNull<IImageGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(ImageCollectionGqlActions),
      resolve: (parent, args, ctx): IImageCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlPagination),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
