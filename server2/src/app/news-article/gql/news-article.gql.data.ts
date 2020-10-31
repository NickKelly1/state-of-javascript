import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NewsArticleModel } from "../news-article.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";


export type INewsArticleGqlDataSource = NewsArticleModel;
export const NewsArticleGqlData: GraphQLObjectType<NewsArticleModel, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    title: { type: GraphQLNonNull(GraphQLString), },
    teaser: { type: GraphQLNonNull(GraphQLString), },
    body: { type: GraphQLNonNull(GraphQLString), },
    author_id: { type: GraphQLNonNull(GraphQLInt), },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
