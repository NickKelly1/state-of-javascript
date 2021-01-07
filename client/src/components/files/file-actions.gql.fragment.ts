
import { gql } from "graphql-request";

/**
 * FileActions Fragment
 */
export const FILE_ACTIONS_GQL_FRAGMENT = gql`
fragment FileActions on FileActions{
  show
  update
  softDelete
  hardDelete
  restore
}
`
