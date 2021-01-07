import { gql } from "graphql-request";

/**
 * UserData Fragment
 */
export const USER_DATA_GQL_FRAGMENT = gql`
fragment UserData on UserData{
  id
  name
  deactivated
  email
  verified
  created_at
  updated_at
  deleted_at
}
`
