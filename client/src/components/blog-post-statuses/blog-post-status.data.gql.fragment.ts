import { gql } from "graphql-request";

/**
 * BlogPostData Fragment
 */
export const BLOG_POST_STATUS_DATA_GQL_FRAGMENT = gql`
fragment BlogPostStatusData on BlogPostStatusData{
  id
  name
  colour
  created_at
  updated_at
}
`
