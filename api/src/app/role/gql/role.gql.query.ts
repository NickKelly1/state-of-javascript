import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { RoleLang } from "../role.lang";
import { IRoleCollectionGqlNodeSource, RoleCollectionGqlNode } from "./role.collection.gql.node";
import { RoleCollectionOptionsGqlInput } from "./role.collection.gql.options";

export const RoleGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  roles: {
    type: GraphQLNonNull(RoleCollectionGqlNode),
    args: gqlQueryArg(RoleCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IRoleCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.rolePolicy.canAccess(), RoleLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.rolePolicy.canFindMany(), RoleLang.NotFound);
      // find
      const collection = await ctx.services.roleRepository.gqlCollection({
        args,
        runner: null,
      });
      return collection;
    },
  },
});