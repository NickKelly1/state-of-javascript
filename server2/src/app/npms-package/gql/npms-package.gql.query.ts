import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { Op } from "sequelize";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { NpmsPackageModel } from "../npms-package.model";
import { INpmsPackageCollectionGqlNodeSource, NpmsPackageCollectionGqlNode } from "./npms-package.collection.gql.node";
import { NpmsPackageCollectionOptionsGqlInput } from "./npms-package.collection.gql.options";

export const NpmsPackageGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  npmsPackages: {
    type: GraphQLNonNull(NpmsPackageCollectionGqlNode),
    args: gqlQueryArg(NpmsPackageCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<INpmsPackageCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsPackagePolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.npmsPackageRepository.findAllAndCount({
        runner: null,
        options: { ...options, },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: INpmsPackageCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<NpmsPackageModel> =>
          ctx.services.npmsPackagePolicy.canFindOne({ model })
            ? model
            : null
          ),
        pagination,
      };
      return connection;
    },
  },
});