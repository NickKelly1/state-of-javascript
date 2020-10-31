import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type INpmsPackageCollectionGqlActionSource = IGqlNever;
export const NpmsPackageCollectionGqlActions = new GraphQLObjectType<INpmsPackageCollectionGqlActionSource, GqlContext>({
  name: 'NpmsPackageCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsPackagePolicy.canFindMany();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsPackagePolicy.canCreate();
      },
    },
  },
});
