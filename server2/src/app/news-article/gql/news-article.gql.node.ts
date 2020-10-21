import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { NewsArticleModel } from "../news-article.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserGqlEdge, UserGqlEdge } from "../../user/gql/user.gql.edge";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";


export type INewsArticleGqlNode = NewsArticleModel;
export const NewsArticleGqlNode: GraphQLObjectType<NewsArticleModel, GqlContext> = new GraphQLObjectType<NewsArticleModel, GqlContext>({
  name: 'NewsArticle',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    title: { type: GraphQLNonNull(GraphQLString), },
    teaser: { type: GraphQLNonNull(GraphQLString), },
    body: { type: GraphQLNonNull(GraphQLString), },
    author_id: { type: GraphQLNonNull(GraphQLInt), },
    ...AuditableGql,
    ...SoftDeleteableGql,

    author: {
      type: GraphQLNonNull(UserGqlEdge),
      resolve: async (parent, args, ctx): Promise<OrNull<IUserGqlEdge>> => {
        const model = await ctx.loader.users.load(parent.author_id);
        const edge: IUserGqlEdge = { node: model, cursor: model.id.toString(), };
        if (!ctx.services.userPolicy().canFindOne({ model })) return null;
        return edge;
      },
    },
  }),
});
