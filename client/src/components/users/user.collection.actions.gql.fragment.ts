import { gql } from "graphql-request";

/**
 * UserCollectionActions Fragment
 */
export const UserCollectionActionsGqlFragment = gql`
fragment UserCollectionActions on UserCollectionActions{
  show
  login
  register
  logout
  create
}
`
