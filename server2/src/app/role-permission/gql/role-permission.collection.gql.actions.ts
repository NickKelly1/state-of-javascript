import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IRolePermissionCollectionGqlActionSource = IGqlNever;
export const RolePermissionCollectionGqlActions = new GraphQLObjectType<IRolePermissionCollectionGqlActionSource, GqlContext>({
  name: 'RolePermissionCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GqlAction),
      resolve: async (parent, args, ctx): Promise<IGqlActionSource> => {
        return { can: ctx.services.rolePermissionPolicy.canFindMany() };
      },
    },
    create: {
      type: GraphQLNonNull(GqlAction),
      resolve: async (parent, args, ctx): Promise<IGqlActionSource> => {
        return { can: ctx.services.rolePermissionPolicy.canCreate() };
      },
    },
  },
});
