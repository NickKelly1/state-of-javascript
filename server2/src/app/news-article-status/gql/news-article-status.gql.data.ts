import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { NewsArticleStatusModel } from "../news-article-status.model";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";


export type INewsArticleStatusGqlDataSource = NewsArticleStatusModel;
export const NewsArticleStatusGqlData: GraphQLObjectType<NewsArticleStatusModel, GqlContext> = new GraphQLObjectType({
  name: 'NewsArticleStatusData',
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
