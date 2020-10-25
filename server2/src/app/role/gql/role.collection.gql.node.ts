import { GqlContext } from "../../../common/classes/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";
import { RoleModel } from "../role.model";
import { IRoleGqlNodeSource, RoleGqlNode } from "./role.gql.node";
import { IRoleCollectionGqlActionSource, RoleCollectionGqlActions } from "./role.collection.gql.actions";


export interface IRoleCollectionGqlNodeSource {
  models: OrNull<RoleModel>[];
  pagination: ICollectionMeta;
}
export const RoleCollectionGqlNode: GraphQLObjectType<IRoleCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'RoleCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(RoleGqlNode)),
      resolve: (parent, args, ctx): OrNull<IRoleGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(RoleCollectionGqlActions),
      resolve: (parent, args, ctx): IRoleCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
