import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";
import { BlogPostCommentField } from "../blog-post-comment.attributes";

const GqlBlogPostCommentFilterFields = {
  [BlogPostCommentField.id]: GqlFilterFieldType.Number,
  [BlogPostCommentField.body]: GqlFilterFieldType.String,
  [BlogPostCommentField.hidden]: GqlFilterFieldType.Boolean,
  [BlogPostCommentField.visible]: GqlFilterFieldType.Boolean,
  [BlogPostCommentField.author_id]: GqlFilterFieldType.Number,
  // TODO: image
  [BlogPostCommentField.created_at]: GqlFilterFieldType.DateTime,
  [BlogPostCommentField.updated_at]: GqlFilterFieldType.DateTime,
  [BlogPostCommentField.deleted_at]: GqlFilterFieldType.DateTime,
}

export const BlogPostCommentCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'BlogPostComment',
  filters: GqlBlogPostCommentFilterFields,
});
