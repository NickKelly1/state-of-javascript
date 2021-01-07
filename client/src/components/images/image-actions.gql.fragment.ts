
import { gql } from "graphql-request";

/**
 * ImageActions Fragment
 */
export const IMAGE_ACTIONS_GQL_FRAGMENT = gql`
fragment ImageActions on ImageActions{
  show
  update
  softDelete
  hardDelete
  restore
}
`
