import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlPagination, IGqlMetaSource } from "../../../common/gql/gql.pagination";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { FileModel } from "../../../circle";
import { IFileGqlNodeSource, FileGqlNode } from "./file.gql.node";
import { FileCollectionGqlActions, IFileCollectionGqlActionSource } from "./file.collection.gql.actions";


export interface IFileCollectionGqlNodeSource {
  models: OrNull<FileModel>[];
  pagination: ICollectionMeta;
}
export const FileCollectionGqlNode: GraphQLObjectType<IFileCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'FileCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(FileGqlNode)),
      resolve: (parent, args, ctx): OrNull<IFileGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(FileCollectionGqlActions),
      resolve: (parent, args, ctx): IFileCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlPagination),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
