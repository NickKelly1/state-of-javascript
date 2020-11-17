import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NewsArticleStatusModel } from "../news-article-status.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";


export type INewsArticleStatusGqlDataSource = NewsArticleStatusModel;
export const NewsArticleStatusGqlData: GraphQLObjectType<NewsArticleStatusModel, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleStatusData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
  }),
});
