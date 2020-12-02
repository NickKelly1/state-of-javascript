import { GqlContext } from "../../../common/context/gql.context";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UserModel } from "../user.model";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { IUserCollectionGqlActionSource, UserCollectionGqlActions } from "./user.collection.gql.actions";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { IUserGqlNodeSource, UserGqlNode } from "./user.gql.node";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";


export interface IUserCollectionGqlNodeSource {
  models: OrNull<UserModel>[];
  pagination: ICollectionMeta;
}
export const UserCollectionGqlNode: GraphQLObjectType<IUserCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'UserCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(UserGqlNode)),
      resolve: (parent, args, ctx): OrNull<IUserGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(UserCollectionGqlActions),
      resolve: (parent, args, ctx): IUserCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
