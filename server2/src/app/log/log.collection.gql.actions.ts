import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean } from "graphql";
import { GqlContext } from "../../common/context/gql.context";
import { IGqlNever } from "../../common/gql/gql.ever";

export type ILogCollectionGqlActionSource = IGqlNever;
export const LogCollectionGqlActions = new GraphQLObjectType<ILogCollectionGqlActionSource, GqlContext>({
  name: 'LogCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.logPolicy.canFindMany();
      },
    },
  },
});