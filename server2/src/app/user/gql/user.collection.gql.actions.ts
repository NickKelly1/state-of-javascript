import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IUserCollectionGqlActionSource = IGqlNever;
export const UserCollectionGqlActions = new GraphQLObjectType<IUserCollectionGqlActionSource, GqlContext>({
  name: 'UserCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canFindMany();
      },
    },
    register: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canRegister();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.userPolicy.canCreate();
      },
    },
  },
});
