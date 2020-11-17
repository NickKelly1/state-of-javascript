import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type INpmsDashboardStatusCollectionGqlActionSource = IGqlNever;
export const NpmsDashboardStatusCollectionGqlActions = new GraphQLObjectType<INpmsDashboardStatusCollectionGqlActionSource, GqlContext>({
  name: 'NpmsDashboardStatusCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.newsArticleStatusPolicy.canFindMany();
      },
    },
  },
});
