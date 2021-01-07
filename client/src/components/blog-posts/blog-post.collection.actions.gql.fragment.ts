import { gql } from "graphql-request";

/**
 * BlogPostCollectionActions Fragment
 */
export const BLOG_POST_COLLECTION_ACTIONS_GQL_FRAGMENT = gql`
fragment BlogPostCollectionActions on BlogPostCollectionActions{
  show
  create
}
`
