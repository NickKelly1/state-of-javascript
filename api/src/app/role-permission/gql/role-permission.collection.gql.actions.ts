import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IRolePermissionCollectionGqlActionSource = IGqlNever;
export const RolePermissionCollectionGqlActions = new GraphQLObjectType<IRolePermissionCollectionGqlActionSource, GqlContext>({
  name: 'RolePermissionCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePermissionPolicy.canFindMany();
      },
    },
  },
});
