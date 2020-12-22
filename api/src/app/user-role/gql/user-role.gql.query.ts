import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { UserRoleLang } from "../../../common/i18n/packs/user-role.lang";
import { UserRoleCollectionGqlNode, IUserRoleCollectionGqlNodeSource } from "./user-role.collection.gql.node";
import { UserRoleCollectionOptionsGqlInput } from "./user-role.collection.gql.options";

export const UserRoleGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  userRoles: {
    type: GraphQLNonNull(UserRoleCollectionGqlNode),
    args: gqlQueryArg(UserRoleCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IUserRoleCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.userRolePolicy.canAccess(), UserRoleLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.userRolePolicy.canFindMany(), UserRoleLang.CannotFindMany);
      // find
      const collection = ctx.services.userRoleRepository.gqlCollection({
        runner: null,
        args,
        where: null,
      });
      return collection;
    },
  },
});