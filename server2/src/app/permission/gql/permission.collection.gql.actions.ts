import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IPermissionCollectionGqlActionSource = IGqlNever;
export const PermissionCollectionGqlActions = new GraphQLObjectType<IPermissionCollectionGqlActionSource, GqlContext>({
  name: 'PermissionCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GqlAction),
      resolve: async (parent, args, ctx): Promise<IGqlActionSource> => {
        return { can: ctx.services.permissionPolicy().canFindMany() };
      },
    },
    create: {
      type: GraphQLNonNull(GqlAction),
      resolve: async (parent, args, ctx): Promise<IGqlActionSource> => {
        return { can: ctx.services.permissionPolicy().canCreate() };
      },
    },
  },
});
