import { gql } from "graphql-request";

/**
 * AllBostPostActions Fragment
 */
export const allBlogPostActionsFragment = gql`
fragment AllBlogPostActions on BlogPostActions{
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
