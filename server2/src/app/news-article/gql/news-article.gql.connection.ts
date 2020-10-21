import { GqlConnection, IGqlConnection } from "../../../common/gql/gql.connection";
import { INewsArticleGqlEdge, NewsArticleGqlEdge } from "./news-article.gql.edge";
import { OrNull } from "../../../common/types/or-null.type";

export type INewsArticleGqlConnection =  IGqlConnection<OrNull<INewsArticleGqlEdge>>;
export const NewsArticleGqlConnection = GqlConnection({
  name: 'NewsArticleConnection',
  edge: () => NewsArticleGqlEdge,
});
