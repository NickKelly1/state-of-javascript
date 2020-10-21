import { GqlQueryInputFactory } from "../../../common/gql/gql.query";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

const GqlNewsArticleFilterFields = {
  id: GqlFilterFieldType.Number,
  title: GqlFilterFieldType.String,
  teaser: GqlFilterFieldType.String,
  body: GqlFilterFieldType.String,
  author_id: GqlFilterFieldType.Number,
  // TODO: image
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const GqlNewsArticleQuery = GqlQueryInputFactory({
  name: 'NewsArticle',
  filters: GqlNewsArticleFilterFields,
})