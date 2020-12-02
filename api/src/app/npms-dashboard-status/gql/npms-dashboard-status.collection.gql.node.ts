import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { NewsArticleStatusModel } from "../../../circle";
import { INpmsDashboardStatusGqlNodeSource, NpmsDashboardStatusGqlNode } from "./npms-dashboard-status.gql.node";
import { INpmsDashboardStatusCollectionGqlActionSource, NpmsDashboardStatusCollectionGqlActions } from "./npms-dashboard-status.collection.gql.actions";


export interface INpmsDashboardStatusCollectionGqlNodeSource {
  models: OrNull<NewsArticleStatusModel>[];
  pagination: ICollectionMeta;
}
export const NpmsDashboardStatusCollectionGqlNode: GraphQLObjectType<INpmsDashboardStatusCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardStatusCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(NpmsDashboardStatusGqlNode)),
      resolve: (parent, args, ctx): OrNull<INpmsDashboardStatusGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(NpmsDashboardStatusCollectionGqlActions),
      resolve: (parent, args, ctx): INpmsDashboardStatusCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
