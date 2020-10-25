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
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const author = await ctx.loader.users.load(parent.author_id);
        return ctx.services.newsArticlePolicy().canUpdate({ model: parent, author });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const author = await ctx.loader.users.load(parent.author_id);
        return ctx.services.newsArticlePolicy().canDelete({ model: parent, author });
      },
    },
  },
});
