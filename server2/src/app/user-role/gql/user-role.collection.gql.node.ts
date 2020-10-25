import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserRoleModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { ICollectionMeta } from "../../../common/interfaces/collection-meta.interface";
import { GqlMeta, IGqlMetaSource } from "../../../common/gql/gql.meta";
import { IUserRoleGqlNodeSource, UserRoleGqlNode } from "./user-role.gql.node";
import { IUserRoleCollectionGqlActionSource, UserRoleCollectionGqlActions } from "./user-role.collection.gql.actions";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlNever } from "../../../common/gql/gql.ever";

export interface IUserRoleCollectionGqlNodeSource {
  models: OrNull<UserRoleModel>[];
  pagination: ICollectionMeta;
}
export const UserRoleCollectionGqlNode: GraphQLObjectType<IUserRoleCollectionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'UserRoleCollectionNode',
  fields: () => ({
    nodes: {
      type: GraphQLNonNull(GraphQLList(UserRoleGqlNode)),
      resolve: (parent, args, ctx): OrNull<IUserRoleGqlNodeSource>[] => parent.models,
    },
    can: {
      type: GraphQLNonNull(UserRoleCollectionGqlActions),
      resolve: (parent, args, ctx): IUserRoleCollectionGqlActionSource => GqlNever,
    },
    pagination: {
      type: GraphQLNonNull(GqlMeta),
      resolve: (parent, args, ctx): IGqlMetaSource => parent.pagination,
    },
  }),
});
