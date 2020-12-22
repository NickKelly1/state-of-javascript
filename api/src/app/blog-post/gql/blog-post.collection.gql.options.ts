import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";
import { BlogPostField } from "../blog-post.attributes";

const GqlBlogPostFilterFields = {
  [BlogPostField.id]: GqlFilterFieldType.Number,
  [BlogPostField.author_id]: GqlFilterFieldType.Number,
  [BlogPostField.status_id]: GqlFilterFieldType.Number,
  [BlogPostField.title]: GqlFilterFieldType.String,
  [BlogPostField.teaser]: GqlFilterFieldType.String,
  [BlogPostField.body]: GqlFilterFieldType.String,
  // [BlogPostField.TODO]: image
  [BlogPostField.created_at]: GqlFilterFieldType.DateTime,
  [BlogPostField.updated_at]: GqlFilterFieldType.DateTime,
  [BlogPostField.deleted_at]: GqlFilterFieldType.DateTime,
}

export const BlogPostCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'BlogPost',
  filters: GqlBlogPostFilterFields,
});
