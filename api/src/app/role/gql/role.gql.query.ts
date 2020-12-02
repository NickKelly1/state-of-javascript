import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { RoleModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IRoleCollectionGqlNodeSource, RoleCollectionGqlNode } from "./role.collection.gql.node";
import { RoleCollectionOptionsGqlInput } from "./role.collection.gql.options";

export const RoleGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  roles: {
    type: GraphQLNonNull(RoleCollectionGqlNode),
    args: gqlQueryArg(RoleCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IRoleCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.rolePolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.roleRepository.findAllAndCount({
        runner: null,
        options: { ...options, },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: IRoleCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<RoleModel> =>
          ctx.services.rolePolicy.canFindOne({ model })
            ? model
            : null
        ),
        pagination,
      };
      return connection;
    },
  },
});