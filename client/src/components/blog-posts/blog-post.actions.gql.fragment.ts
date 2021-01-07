import { gql } from "graphql-request";

/**
 * BlogPostActions Fragment
 */
export const BLOG_POST_ACTIONS_GQL_FRAGMENT = gql`
fragment BlogPostActions on BlogPostActions{
  show
  showComments
  createComments
  update
  softDelete
  hardDelete
  restore
  submit
  reject
  approve
  publish
  unpublish
}
`
