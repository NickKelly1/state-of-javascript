import { gql } from "graphql-request";

/**
 * UserActions Fragment
 */
export const USER_ACTIONS_GQL_FRAGMENT = gql`
fragment UserActions on UserActions{
  show
  update
  softDelete
  hardDelete
  restore
  deactivate
  forceUpdateEmail
  forceVerify
  login
  updatePassword
  createUserRoles
  hardDeleteUserRoles
  requestWelcomeEmail
  consumeWelcomeToken
  requestEmailChangeEmail
  consumeEmailChangeToken
  requestPasswordResetEmail
  consumePasswordResetToken
}
`
