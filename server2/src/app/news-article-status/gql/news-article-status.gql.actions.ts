import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { NewsArticleStatusModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


export type INewsArticleStatusGqlActionsSource = NewsArticleStatusModel;
export const NewsArticleStatusGqlActions = new GraphQLObjectType<INewsArticleStatusGqlActionsSource, GqlContext>({
  name: 'NewsArticleStatusActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.newsArticleStatusPolicy.canFindOne({ model: parent });
      },
    },
  },
});
