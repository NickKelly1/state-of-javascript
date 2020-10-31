import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserCollectionGqlNodeSource, UserCollectionGqlNode } from "./user.collection.gql.node";
import { GqlUserCollectionOptionsGqlInput } from "./user.collection.gql.options";

export const UserGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  users: {
    type: GraphQLNonNull(UserCollectionGqlNode),
    args: gqlQueryArg(GqlUserCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IUserCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.userPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.userRepository.findAllAndCount({
        runner: null,
        options: { ...options },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: IUserCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<UserModel> =>
          ctx.services.userPolicy.canFindOne({ model })
            ? model
            : null
          ),
        pagination,
      };
      return connection;
    },
  },
});