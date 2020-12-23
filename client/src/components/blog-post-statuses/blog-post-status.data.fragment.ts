import { gql } from "graphql-request";

/**
 * AllBlogPostData Fragment
 */
export const allBlogPostStatusDataFragment = gql`
fragment AllBlogPostStatusData on BlogPostStatusData{
  id
  name
  colour
  created_at
  updated_at
}
`
