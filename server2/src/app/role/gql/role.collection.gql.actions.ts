import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IRoleCollectionGqlActionSource = IGqlNever;
export const RoleCollectionGqlActions = new GraphQLObjectType<IRoleCollectionGqlActionSource, GqlContext>({
  name: 'RoleCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy().canFindMany();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.rolePolicy().canCreate();
      },
    },
  },
});
