import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NewsArticleModel, PermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IntegrationModel } from "../integration.model";
import { IIntegrationCollectionGqlNodeSource, IntegrationCollectionGqlNode } from "./integration.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "./integration.collection.gql.options";

export const IntegrationGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  integrations: {
    type: GraphQLNonNull(IntegrationCollectionGqlNode),
    args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IIntegrationCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.integrationPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.integrationRepository.findAllAndCount({
        runner: null,
        options: { ...options, },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: IIntegrationCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<IntegrationModel> =>
          ctx.services.integrationPolicy.canFindOne({ model })
            ? model
            : null
        ),
        pagination,
      };
      return connection;
    },
  },
});