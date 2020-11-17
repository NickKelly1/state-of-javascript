import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type INpmsDashboardItemCollectionGqlActionSource = IGqlNever;
export const NpmsDashboardItemCollectionGqlActions = new GraphQLObjectType<INpmsDashboardItemCollectionGqlActionSource, GqlContext>({
  name: 'NpmsDashboardItemCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsDashboardItemPolicy.canFindMany();
      },
    },
  },
});
