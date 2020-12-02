import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
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

export const NewsArticleCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'NewsArticle',
  filters: GqlNewsArticleFilterFields,
})