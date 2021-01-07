import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlPagination, IGqlMetaSource } from "../../../common/gql/gql.pagination";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { NpmsDashboardModel } from "../../../circle";
import { INpmsDashboardGqlNodeSource, NpmsDashboardGqlNode } from "./npms-dashboard.gql.node";
import { INpmsDashboardCollectionGqlActionSource, NpmsDashboardCollectionGqlActions } from "./npms-dashboard.collection.gql.actions";


export interface INpmsDashboardCollectionGqlNodeSource {
  models: OrNull<NpmsDashboardModel>[];
  pagination: ICollectionMeta;
}
export const NpmsDashboardCollectionGqlNode: GraphQLObjectType<INpmsDashboardCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(NpmsDashboardGqlNode)),
      resolve: (parent, args, ctx): OrNull<INpmsDashboardGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(NpmsDashboardCollectionGqlActions),
      resolve: (parent, args, ctx): INpmsDashboardCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlPagination),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
