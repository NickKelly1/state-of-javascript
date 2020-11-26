import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IPermissionCategoryCollectionGqlActionSource = IGqlNever;
export const PermissionCategoryCollectionGqlActions = new GraphQLObjectType<IPermissionCategoryCollectionGqlActionSource, GqlContext>({
  name: 'PermissionCategoryCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.permissionCategoryPolicy.canFindMany();
      },
    },
  },
});
