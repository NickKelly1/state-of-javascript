import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { IntegrationModel } from "../integration.model";
import { IIntegrationGqlNodeSource, IntegrationGqlNode } from "./integration.gql.node";
import { IIntegrationCollectionGqlActionSource, IntegrationCollectionGqlActions } from "./integration.collection.gql.actions";


export interface IIntegrationCollectionGqlNodeSource {
  models: OrNull<IntegrationModel>[];
  pagination: ICollectionMeta;
}
export const IntegrationCollectionGqlNode: GraphQLObjectType<IIntegrationCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'IntegrationCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(IntegrationGqlNode)),
      resolve: (parent, args, ctx): OrNull<IIntegrationGqlNodeSource>[] => parent.models,
    },
    actions: {
      type: GraphQLNonNull(IntegrationCollectionGqlActions),
      resolve: (parent, args, ctx): IIntegrationCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
