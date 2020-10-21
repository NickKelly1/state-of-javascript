import { GraphQLNonNull } from "graphql";
import { GqlEdge, IGqlEdge } from "../../../common/gql/gql.edge";
import { INewsArticleGqlNode, NewsArticleGqlNode } from "./news-article.gql.node";

export type INewsArticleGqlEdge = IGqlEdge<INewsArticleGqlNode>;
export const NewsArticleGqlEdge = GqlEdge({
  node: () => GraphQLNonNull(NewsArticleGqlNode),
  name: 'NewsArticleEdge',
});