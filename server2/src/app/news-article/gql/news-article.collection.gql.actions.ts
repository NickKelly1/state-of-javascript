import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type INewsArticleCollectionGqlActionSource = IGqlNever;
export const NewsArticleCollectionGqlActions = new GraphQLObjectType<INewsArticleCollectionGqlActionSource, GqlContext>({
  name: 'NewsArticleCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.newsArticlePolicy().canFindMany();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.newsArticlePolicy().canCreate();
      },
    },
  },
});
