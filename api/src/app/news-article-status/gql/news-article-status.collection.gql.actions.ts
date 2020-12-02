import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type INewsArticleStatusCollectionGqlActionSource = IGqlNever;
export const NewsArticleStatusCollectionGqlActions = new GraphQLObjectType<INewsArticleStatusCollectionGqlActionSource, GqlContext>({
  name: 'NewsArticleStatusCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.newsArticleStatusPolicy.canFindMany();
      },
    },
  },
});
