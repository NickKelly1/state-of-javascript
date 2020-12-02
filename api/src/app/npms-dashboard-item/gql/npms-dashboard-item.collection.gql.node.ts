import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { INpmsDashboardItemGqlNodeSource, NpmsDashboardItemGqlNode } from "./npms-dashboard-item.gql.node";
import { INpmsDashboardItemCollectionGqlActionSource, NpmsDashboardItemCollectionGqlActions } from "./npms-dashboard-item.collection.gql.actions";
import { NpmsDashboardItemModel } from "../../../circle";


export interface INpmsDashboardItemCollectionGqlNodeSource {
  models: OrNull<NpmsDashboardItemModel>[];
  pagination: ICollectionMeta;
}
export const NpmsDashboardItemCollectionGqlNode: GraphQLObjectType<INpmsDashboardItemCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardItemCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(NpmsDashboardItemGqlNode)),
      resolve: (parent, args, ctx): OrNull<INpmsDashboardItemGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(NpmsDashboardItemCollectionGqlActions),
      resolve: (parent, args, ctx): INpmsDashboardItemCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
