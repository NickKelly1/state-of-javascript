import { GraphQLObjectType } from "graphql";
import { NewsArticleModel } from "../news-article.model";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { GqlContext } from "../../../common/context/gql.context";
import { INewsArticleStatusGqlNodeSource } from "../../news-article-status/gql/news-article-status.gql.node";


export type INewsArticleGqlRelationsSource = NewsArticleModel;
export const NewsArticleGqlRelations: GraphQLObjectType<INewsArticleGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleRelations',
  fields: () => ({
    author: {
      type: UserGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IUserGqlNodeSource>> => {
        const model: OrNull<IUserGqlNodeSource> = await ctx.loader.users.load(parent.author_id);
        if (!model) return null;
        if (!ctx.services.userPolicy.canFindOne({ model })) return null;
        return model;
      },
    },
    status: {
      type: UserGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<INewsArticleStatusGqlNodeSource>> => {
        const model: OrNull<INewsArticleStatusGqlNodeSource> = await ctx.loader.newsArticleStatuses.load(parent.status_id);
        if (!model) return null;
        if (!ctx.services.newsArticleStatusPolicy.canFindOne({ model })) return null;
        return model;
      },
    },
  }),
});
