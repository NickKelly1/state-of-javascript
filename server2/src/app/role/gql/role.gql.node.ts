
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { RoleModel } from "../role.model";
import { IRoleGqlActionsSource, RoleGqlActions } from "./role.gql.actions";
import { IRoleGqlRelationsSource, RoleGqlRelations } from "./role.gql.relations";
import { IRoleGqlDataSource, RoleGqlData } from "./role.gql.data";
import { GqlContext } from "../../../common/context/gql.context";

export type IRoleGqlNodeSource = RoleModel;
export const RoleGqlNode: GraphQLObjectType<IRoleGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'RoleNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `role_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(RoleGqlData),
      resolve: (parent): IRoleGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(RoleGqlActions),
      resolve: (parent): IRoleGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(RoleGqlRelations),
      resolve: function (parent): IRoleGqlRelationsSource {
        return parent;
      },
    },
  }),
});