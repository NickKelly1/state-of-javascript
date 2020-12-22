import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

const GqlBlogPostStatusFilterFields = {
  id: GqlFilterFieldType.Number,
  name: GqlFilterFieldType.String,
  colour: GqlFilterFieldType.String,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const BlogPostStatusCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'BlogPostStatus',
  filters: GqlBlogPostStatusFilterFields,
})
