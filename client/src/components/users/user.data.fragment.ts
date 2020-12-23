import { gql } from "graphql-request";

/**
 * AllUserData Fragment
 */
export const allUserDataFragment = gql`
fragment AllUserData on UserData{
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
