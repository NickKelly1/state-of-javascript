
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UserModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";
import { PermissionModel } from "../permission.model";
import { IPermissionGqlActionsSource, PermissionGqlActions } from "./permission.gql.actions";
import { IPermissionGqlRelationsSource, PermissionGqlRelations } from "./permission.gql.relations";
import { IPermissionGqlDataSource, PermissionGqlData } from "./permission.gql.data";

export type IPermissionGqlNodeSource = PermissionModel;
export const PermissionGqlNode: GraphQLObjectType<IPermissionGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'PermissionNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `permission_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(PermissionGqlData),
      resolve: (parent): IPermissionGqlDataSource => parent,
    },
    actions: {
      type: GraphQLNonNull(PermissionGqlActions),
      resolve: (parent): IPermissionGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(PermissionGqlRelations),
      resolve: function (parent): IPermissionGqlRelationsSource {
        return parent;
      },
    },
  }),
});