import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { NewsArticleModel } from "../../../circle";
import { GqlContext } from "../../../common/classes/gql.context";


export type INewsArticleGqlActionsSource = NewsArticleModel;
export const NewsArticleGqlActions = new GraphQLObjectType<INewsArticleGqlActionsSource, GqlContext>({
  name: 'NewsArticleActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.newsArticlePolicy().canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.newsArticlePolicy().canUpdate({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.newsArticlePolicy().canDelete({ model: parent });
      },
    },
  },
});
