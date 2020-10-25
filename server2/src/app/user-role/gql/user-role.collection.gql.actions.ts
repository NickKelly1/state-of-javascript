import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { GqlAction, IGqlActionSource } from "../../../common/gql/gql.action";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IUserRoleCollectionGqlActionSource = IGqlNever;
export const UserRoleCollectionGqlActions = new GraphQLObjectType<IUserRoleCollectionGqlActionSource, GqlContext>({
  name: 'UserRoleCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy().canFindMany();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userRolePolicy().canCreate();
      },
    },
  },
});
