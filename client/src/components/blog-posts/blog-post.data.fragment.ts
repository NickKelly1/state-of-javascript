import { gql } from "graphql-request";

/**
 * AllBostPostData Fragment
 */
export const allBlogPostDataFragment = gql`
fragment AllBlogPostData on BlogPostData{
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
