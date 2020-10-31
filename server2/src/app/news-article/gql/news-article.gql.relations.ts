import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { NewsArticleModel } from "../news-article.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { GqlContext } from "../../../common/context/gql.context";


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
  }),
});
