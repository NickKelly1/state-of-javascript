import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type INpmsDashboardCollectionGqlActionSource = IGqlNever;
export const NpmsDashboardCollectionGqlActions = new GraphQLObjectType<INpmsDashboardCollectionGqlActionSource, GqlContext>({
  name: 'NpmsDashboardCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsDashboardPolicy.canFindMany();
      },
    },
    sort: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsDashboardPolicy.canSort();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsDashboardPolicy.canCreate();
      },
    },
  },
});
