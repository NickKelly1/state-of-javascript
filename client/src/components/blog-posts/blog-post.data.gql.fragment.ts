import { gql } from "graphql-request";

/**
 * BlogPostData Fragment
 */
export const BLOG_POST_DATA_GQL_FRAGMENT = gql`
fragment BlogPostData on BlogPostData{
  id
  title
  teaser
  body
  author_id
  created_at
  updated_at
  deleted_at
}
`
