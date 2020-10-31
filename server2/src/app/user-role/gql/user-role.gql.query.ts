import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { UserModel, UserRoleModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { UserRoleCollectionGqlNode, IUserRoleCollectionGqlNodeSource } from "./user-role.collection.gql.node";
import { UserRoleCollectionOptionsGqlInput } from "./user-role.collection.gql.options";

export const UserRoleGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  userRoles: {
    type: GraphQLNonNull(UserRoleCollectionGqlNode),
    args: gqlQueryArg(UserRoleCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IUserRoleCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.userPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.userRoleRepository.findAllAndCount({
        runner: null,
        options: { ...options, },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: IUserRoleCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<UserRoleModel> =>
          ctx.services.userRolePolicy.canFindOne({ model })
            ? model
            : null
        ),
        pagination,
      };
      return connection;
    },
  },
});