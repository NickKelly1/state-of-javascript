import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IPermissionCollectionGqlActionSource = IGqlNever;
export const PermissionCollectionGqlActions = new GraphQLObjectType<IPermissionCollectionGqlActionSource, GqlContext>({
  name: 'PermissionCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.permissionPolicy.canFindMany();
      },
    },
  },
});
