import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { NpmsPackageLang } from "../npms-package.lang";
import { INpmsPackageCollectionGqlNodeSource, NpmsPackageCollectionGqlNode } from "./npms-package.collection.gql.node";
import { NpmsPackageCollectionOptionsGqlInput } from "./npms-package.collection.gql.options";

export const NpmsPackageGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  npmsPackages: {
    type: GraphQLNonNull(NpmsPackageCollectionGqlNode),
    args: gqlQueryArg(NpmsPackageCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INpmsPackageCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.npmsPackagePolicy.canAccess(), NpmsPackageLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.npmsPackagePolicy.canFindMany(), NpmsPackageLang.CannotFindMany);
      // find
      const collection = await ctx.services.npmsPackageRepository.gqlCollection({
        runner: null,
        args,
      });
      return collection;
    },
  },
});